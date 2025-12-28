export type TCustomAudioProps = HTMLAudioElement | null

export default class instanceOnceAudio {
  _instance: TCustomAudioProps
  constructor() {
    this._instance = null

    this.create()
  }

  /**
   * 创建Audio的单例
   * create
   */
  private create() {
    if (this._instance) {
      return this._instance
    }
    if (typeof Audio !== 'undefined') {
      this._instance = new Audio()
      this._instance.setAttribute('id', 'audio-only')
      this._instance.setAttribute('data-timestamp', `${new Date().getTime()}`)
      this._instance.muted = false
      this._instance.volume = 0.5
      this._instance.autoplay = false

      return this._instance
    }
  }
}
