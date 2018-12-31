import { Packet } from '../packet'
import {
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_SOLICIT,
  WEBRTC_CANDIDATE,
  PEER
} from '../constants'

export class Peer {

  private sendToServer: Function
  private sendToStore: Function
  private peerId: string
  private connection: RTCPeerConnection
  private channel?: RTCDataChannel
  private channelSettings = { ordered: false, maxRetransmits: 0 }

  constructor (
    peerId: string,
    sendToServer: Function,
    sendToStore: Function,
    stunServers: string[] = []
  ) {
    this.peerId = peerId
    this.sendToServer = sendToServer
    this.sendToStore = sendToStore
    this.connection = new RTCPeerConnection({
      iceServers: stunServers.map(url => ({ urls: url }))
    })
    this.connection.addEventListener('icecandidate', (event) => {
      console.log(this.peerId, 'onicecandidate', event)
      if (!event.candidate) return
      this.sendToServer(new Packet({
        type: WEBRTC_CANDIDATE,
        payload: { candidate: event.candidate, peerId: this.peerId}
      }))
    })
    this.connection.ondatachannel = (event: any) => {
      console.log(this.peerId, 'ondatachannel')
      this.channel = event.channel
      event.channel.onmessage = onmessage
    }
    this.connection.addEventListener('open', () => {
      console.log(this.peerId, 'onopen')
    })
  }

  public send = (packet: Packet) => {
    if (this.channel && this.channel.readyState === 'open') {
      packet.type = this.peerId
      this.channel.send(JSON.stringify(packet))
    }
  }

  public receiveFromServer = async (packet: Packet) => {
    if (packet.type === WEBRTC_SOLICIT) {
      this.createChannel()
      await this.sendOffer()
    } else if (packet.type === WEBRTC_OFFER) {
      await this.sendAnswer(packet.payload.offer)
    } else if (packet.type === WEBRTC_ANSWER) {
      await this.connection.setRemoteDescription(packet.payload.answer)
    } else if (packet.type === WEBRTC_CANDIDATE) {
      await this.connection.addIceCandidate(packet.payload.candidate)
    }
  }

  public close = () => {
    this.connection.close()
  }

  private sendOffer = async (): Promise<void> => {
    const offer = await this.connection.createOffer()
    console.log(this.peerId, 'setLocalDescription', offer)
    await this.connection.setLocalDescription(offer)
    this.sendToServer(new Packet({
      type: WEBRTC_OFFER,
      payload: { offer, peerId: this.peerId }
    }))
  }

  private sendAnswer = async (offer: any) => {
    console.log(this.peerId, 'setRemoteDescription', offer)
    await this.connection.setRemoteDescription(offer)
    const answer = await this.connection.createAnswer()
    console.log(this.peerId, 'setLocalDescription', answer)
    await this.connection.setLocalDescription(answer)
    this.sendToServer(new Packet({
      type: WEBRTC_ANSWER,
      payload: { answer, peerId: this.peerId }
    }))
  }

  private createChannel = (name: string = 'data') => {
    this.channel = this.connection.createDataChannel(
      name,
      this.channelSettings
    )
    this.channel.onmessage = this.onmessage
  }

  private onmessage = (event: any) => {
    const data: any = JSON.parse(event.data)

    // sanity check
    if (data.type !== this.peerId) return

    // apply optimistic packet
    const packet = new Packet({ ...data, trust: PEER, time: Date.now() })
    this.sendToStore(packet)
  }
}
