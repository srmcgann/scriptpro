<template>
  <div class="main">
     <div v-html="state.headerText" class="header"></div>
     <div
       @touchstart="$refs['scriptInput'].focus()"
       @click="$refs['scriptInput'].focus()"
       @mousedown="$refs['scriptInput'].focus()"
       id="debug"
       ref="debug"
     ></div>
     <div
       contenteditable
       @scroll="doScroll()"
       spellcheck="false"
       ref="scriptInput"
       id="scriptInput"
       class="textareas"
       @keydown="processInput()"
       @keypress="processInput()"
       @input="processInput()"
     ></div>
  </div>
</template>

<script>

export default {
  name: 'Main',
  props: [ 'state' ],
  data(){
    return {
      oscript: ''
    }
  },
  methods:{
    doScroll(){
      this.$refs['debug'].style.opacity = 0
      this.$nextTick(()=>{
        console.log(this.state.scriptInput.scrollTop)
        this.$refs['debug'].scrollTo(0, this.state.scriptInput.scrollTop)
        this.$refs['debug'].style.opacity = 1
      })
    },
    redraw(oldval, newval){
      let oldTokens = this.state.oldTokens = this.tokenize(oldval.trim())
      let newTokens = this.state.newTokens = this.tokenize(newval.trim())
      let out = ''
      let leading = true
      oldval.split('').map(v=>{
        let code = v.charCodeAt(0)
        if((code == 160 || code == 32 || code == 10 || code == 13) && leading){
          if(code == 160 || code == 32) out += '&nbsp;'
          if(code == 10 || code == 13) out += "<br>"
        }else{
          leading = false
        }
      })
      for(let i=0;i<oldval.length;++i){
        let v = oldval[i]
        let highlight = false
        let fresh = true
        oldTokens.map((q, j)=>{
          if(!fresh) return
          if(q.pos == i){
            fresh = false
            highlight = true
            let gb = newTokens[j].value == q.value
            let style = i<200 ? 'style="margin-top: 15px;"' : ''
            out += (gb ? '' : '<button '+style+' onmouseover="this.focus()" onmouseleave="window.res()" onclick="window.swp('+j+')" class="cor" id="corbut'+j+'">'+newTokens[j].value+'</button>')
            out += '<span id="cordiv'+j+'" tabindex="'+j+'"'
            out += (gb ? '' : 'onmouseleave="window.ob('+j+')" onmouseover="window.tv('+j+')" ')
            out += 'class="' + (gb?'good':'bad') + 'Class">'
            i += q.value.length-1
            out += q.value=="\n"?"":q.value
            //out += q.value==' '?'&nbsp;':q.value
          }
        })
        if(highlight){
          out += '</span>'
        }
        if(v == "\n") out += "\n"
      }
      console.log(out)
      this.$refs['debug'].style.opacity = 0
      this.$refs['debug'].innerHTML = out + "\n"
      this.doScroll()
    },
    getCorrection(){
      if(!this.state.scriptInput.innerText){
        this.$refs['debug'].innerHTML = ''
        return
      }
      let sendData = {text: this.state.scriptInput.innerText}
      fetch('https://'+this.state.rootDomain+'/autosyntax/autocorrect.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendData),
      }).then(res=>res.text()).then(data=>{
        if(data){
          data = data.split('').map(v=>{
            if(v.charCodeAt(0) == 160) v = String.fromCharCode(32)
            return v
          }).join('')
          this.redraw(sendData.text, data)
        } else {
          this.redraw('', '')
        }
      })
    },
    tokenize(str){
      if(!str) return []
      let tokens = []
      let token = {pos: 0, value: ''}
      str.split('').map((v, i) => {
         if((/^[a-zA-Z0-9]/).test(v)){
           if((/^[a-zA-Z0-9]/).test(token.value[token.value.length-1])) token.value  += v
             else{
               tokens=[...tokens, token]
               token = {pos: i, value: v}
             }
         }else{
           tokens=[...tokens, token]
           token = {pos: i, value: v}
         }
      })
      if(token) tokens=[...tokens, token]
      return tokens
    },
    processInput(){
      let script = this.state.scriptInput.innerText
      if(!script) this.$refs['debug'].innerHTML=''
      if(!script || this.oscript == script) return
      this.oscript = script
      this.$refs['debug'].innerHTML=''
      let tokens = this.tokenize(script)
      if(tokens.length){
        this.state.tokens = tokens.map(v=>{
          return {
            token: v,
            stale: true,
            correction: '',
          }
        })
      } else {
        this.state.tokens = []
        this.tokens = []
        this.$refs['debug'].innerHTML=''
      }
      this.getCorrection()
    }
  },
  mounted(){
    this.state.scriptInput = this.$refs['scriptInput']
    this.state.scriptInput.focus()
     window.tv = e => {
       document.querySelector('#corbut' + e).style.display='inline-block'
     }
     window.res=()=>{
       this.$refs['scriptInput'].focus()
     }
     window.swp = e => {
       let swptgt = this.state.newTokens[e]
       let out = ''
       for(let i = 0; i < this.state.scriptInput.innerText.length; ++i){
         let v = this.state.scriptInput.innerText[i]
         if(i==swptgt.pos){
           let olen = this.state.oldTokens[e].value.length
           out += swptgt.value
           i += olen-1
         }else{
           out += v
         }
       }
       this.state.scriptInput.innerText = out
       this.processInput()
     }
     window.ob = e => {
       setTimeout(()=>{
         let divel = document.querySelector('#cordiv' + e)
         let butel = document.querySelector('#corbut' + e)
         if((document.activeElement != divel && document.activeElement != butel)) butel.style.display='none'
       }, 200)
     }
  }
}
</script>

<style>
.main{
  margin: 0px;
  padding: 0px;
}
#scriptInput{
  background: #3330;
  color: #8ffa;
  width: 100%;
  margin-top: 16px;
  height: calc(100vh - 20px);
  font-family: courier;
  display: inline-block;
  font-size: 14px;
  white-space: pre-line;
  position: relative;
  z-index: 5;
  overflow: auto;
  word-break: break-all;
  box-sizing: border-box;
}
#scriptInput:focus{
  outline: none;
}
#debug{
  position: absolute;
  top: 16px;
  z-index: 15;
  width: 100%;
  font-family: courier;
  font-size: 14px;
  width: calc(100% - 2px);
  height: calc(100% - 20px);
  left: 0px;
  overflow-y:auto;
  overflow-x: hidden;
  color: #8ffa;
  white-space: pre-line;
  pointer-events: none;
  word-break: break-all;
}
.cor{
  position: absolute;
  margin-top: -15px;
  border: none;
  pointer-events: all;
  border-radius: 25px;
  color: #fff;
  z-index: 200;
  cursor: pointer;
  background: #086;
  font-size: 12px;
  display: none;
  z-index: 1000;
}
.cor:focus{
  outline: none;
}
.goodClass, .badClass{
  z-index: 200;
  position: relative;
}
.goodClass{
  color: #0fca;
  background: #4f82;
}
.badClass{
  color: #f88a;
  pointer-events: all;
  background: #f486;
  cursor: pointer;
}
.header{
  background: linear-gradient(90deg, #000, #0ff);
  position: fixed;
  z-index: 0;
  width: 100%;
}
</style>
