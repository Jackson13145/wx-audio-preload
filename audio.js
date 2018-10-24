class Audio {
  constructor() {
    this.audioMap = {}
  }

  // 获取播放状态
  getIsPlaying(options = {}) {
    let { audioSrc } = options
    let { audioMap } = this

    if (audioMap[audioSrc]) {
      return audioMap[audioSrc].isPlaying
    }
    return false
  }

  // 创建音频实例
  getAudioContext(audioSrc) {
    let audioContext = wx.createInnerAudioContext()

    audioContext.src = audioSrc

    return audioContext
  }

  // 初始化所有音频
  init(audioSrcs = []) {
    let { audioMap, getAudioContext } = this

    audioSrcs.forEach((key, index) => {
      if (!audioMap[key]) {
        audioMap[key] = {
          context: getAudioContext(key),
          isPlaying: false
        }
      }
    })
  }

  start(options = {}) {
    let {
      audioSrc,
      onEndedCallBack,
      onPlayCallBack,
    } = options
    let {
      audioMap,
      getAudioContext,
    } = this

    // 如果没有就增加一条
    if (!audioMap[audioSrc]) {
      audioMap[audioSrc] = {
        context: getAudioContext(audioSrc),
        isPlaying: false
      }
    }

    let currentContext = audioMap[audioSrc]
    let { context, isPlaying } = currentContext

    if (isPlaying) {
      return
    }

    this.play({
      audioSrc
    })

    context.onPlay(() => {
      onPlayCallBack && onPlayCallBack()
    })

    context.onEnded(() => {
      currentContext.isPlaying = false
      onEndedCallBack && onEndedCallBack()
    })
  }

  // 播放音频
  play(options = {}) {
    let { audioSrc } = options
    let { audioMap, stop } = this
    let currentContext = audioMap[audioSrc]
    let { context } = currentContext

    // stop掉所有音频
    Object.keys(audioMap).forEach(key => {
      if (key !== audioSrc && audioMap[key].isPlaying) {
        stop({
          audioSrc: key
        })
      }
    })

    if (currentContext) {
      context.play()
      currentContext.isPlaying = true
    }
  }

  // 停止音频
  stop(options = {}) {
    let { onStopCallBack, audioSrc } = options
    let { audioMap } = this
    let currentContext = audioMap[audioSrc]
    let { context } = currentContext

    if (!currentContext) {
      return
    }

    context.stop()

    context.onStop(() => {
      currentContext.isPlaying = false
      onStopCallBack && onStopCallBack()
    })
  }

  // destroy(options = {}) {
  //   let { audioSrc } = options
  //   let { audioMap } = this
  //   let currentContext = audioMap[audioSrc]
  //   let { context } = currentContext

  //   if (!currentContext) {
  //     return
  //   }

  //   context.destroy()

  //   if (currentContext) {
  //     delete this.audioMap[audioSrc]
  //   }
  // }
}

export default new Audio()