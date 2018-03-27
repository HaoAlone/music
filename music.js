var musicTitle = document.querySelector('.title')
var autor = document.querySelector('.autor')
var bgImg = document.querySelector('.bgImg')
var ulList = document.querySelector('.music-list')
var back = document.querySelector('.back')
var play = document.querySelector('.play')
var forward = document.querySelector('.forward')
var time = document.querySelector('.time')
var progressBar = document.querySelector('.bar')
var progressNow = document.querySelector('.progress-now')

// console.log(play.querySelector('.fa'))

var musicList = []
var audio = new Audio()
var index = 0
var timer


audio.autoplay = true

getMusicList(function (list) {
  musicList = list;//获取音乐信息
  console.log(musicList)
  loadMusic(list[index])//播放音乐，设置音乐信息
  setMusicist(list)
})

 back.onclick = function () {
   index--
   index = (musicList.length + index ) % musicList.length
   loadMusic(musicList[index])
 }

 play.onclick = function () {
   if(audio.paused){
     audio.play()
   }else {
     audio.pause()
   }
   this.querySelector('.fa').classList.toggle('fa-play')
   this.querySelector('.fa').classList.toggle('fa-pause')
 }

forward.onclick = function () {
  index++
  index = index % musicList.length
  loadMusic(musicList[index])
}

console.log(typeof audio.currentTime)
// 每秒更新一次time
audio.onplaying = function () {
  timer = setInterval(function () {
    updateProgress()
  },1000)
}

audio.onpause = function () {
  clearInterval(timer)
}

audio.ontimeupdate = updateProgress()

//点击时间条设置时间
progressBar.onclick = function (e) {
  console.log(getComputedStyle(this).width)
  var perc = e.offsetX / parseInt(getComputedStyle(this).width)
  console.log(perc)
  audio.currentTime = perc * audio.duration
}

//结束自动跳转下一首
audio.onended = function () {
  index++
  index = index % musicList.length
  loadMusic(musicList[index])
}

ulList.addEventListener('click',function (e) {
  console.log(e.target)
  console.log(this.children[1])
  console.log(this.length)
  for(var i=0;i<this.children.length;i++){
    if(e.target == this.children[i]){
      index = i
    }
  }
  loadMusic(musicList[index])
})


//发送请求获取json数据
function getMusicList(callback) {
  var xhr = new XMLHttpRequest();
  //xhr.open('GET','/music.json',true)//本地使用
  xhr.open('GET','https://easy-mock.com/mock/5ab850e58552c322befb8658/music',true)//easy-mock

  xhr.onload= function () {
    if(xhr.readyState == 4){
      if((xhr.status>= 200 && xhr.status < 300) || xhr.status == 304){
        callback(JSON.parse(this.responseText))
      }else{
        console.log(xhr.status+"获取数据失败")
      }
    }else {
      console.log("网络网络连接失败")
    }
  }
  xhr.send()
}
function loadMusic(musicObj) {
  musicTitle.innerText = musicObj.title
  autor.innerText = musicObj.auther
  bgImg.style.backgroundImage = 'url(' + musicObj.img + ')'
  audio.src = musicObj.src
}
function setMusicist(list) {
  var container = document.createDocumentFragment()
  list.forEach(function (val) {
    var li = document.createElement('li')
    li.innerText = val.title + '-' + val.autor
    container.appendChild(li)
  })
  ulList.appendChild(container)
}

function updateProgress() {
  var percent = (audio.currentTime / audio.duration) * 100 + '%'
  progressNow.style.width = percent;

  var minutes = Math.floor(audio.currentTime/60)
  var seconds = Math.floor(audio.currentTime%60) + ''
  seconds = seconds.length == 2?seconds:'0'+seconds
  minutes = minutes.length == 2?minutes:'0'+minutes
  time.innerText = minutes + ':' + seconds
}