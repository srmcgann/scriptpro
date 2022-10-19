<template>
  <div class="main">
     <div v-html="state.headerText" class="header"></div>
     <div
       @touchstart="processFocus()"
       @click="processFocus()"
       @mousedown="processFocus()"
       id="debug"
       ref="debug"
     ></div>
     <textarea
       @scroll="doScroll()"
       spellcheck="false"
       ref="scriptInput"
       id="scriptInput"
       class="textareas"
       @keydown="processInput()"
       @keypress="processInput()"
       @input="processInput()"
     ></textarea>
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
        this.$refs['debug'].scrollTo(0, this.state.scriptInput.scrollTop-0)
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
            let style = ''//i<200 ? 'style="margin-top: 15px;"' : ''
            out += (gb ? '' : '<button '+style+' onmouseover="this.focus()" onclick="window.swp('+j+')" class="cor" id="corbut'+j+'">'+newTokens[j].value+'</button>')
            out += '<span id="cordiv'+j+'" tabindex="'+j+'" '
            out += (gb ? '' : 'onmouseleave="window.ob('+j+')" onmouseover="window.tv('+j+')" ')
            out += 'class="' + (gb?'good':'bad') + 'Class">'
            i += q.value.length-1
            out += q.value=="\n"?"":(q.value == ' '?'&nbsp;':q.value)
            //out += q.value==' '?'&nbsp;':q.value
          }
        })
        if(highlight){
          out += '</span>'
        }
        if(v == "\n") out += "\n"
      }
      this.$refs['debug'].innerHTML = out + "\n\n\n"
      this.doScroll()
    },
    getCorrection(){
      if(!this.state.scriptInput.value){
        this.$refs['debug'].innerHTML = ''
        return
      }
      let sendData = {text: this.state.scriptInput.value}
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
      let script = this.state.scriptInput.value
      if(!script) this.$refs['debug'].innerHTML=''
      if(!script || this.oscript == script) return
      this.oscript = script
      this.$refs['debug'].style.opacity = 0
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
    },
    processFocus(e){
      return
      let divel = document.querySelector('#cordiv' + e)
      let butel = document.querySelector('#corbut' + e)
      if((document.activeElement != divel && document.activeElement != butel)){
        this.state.scriptInput.focus()
      }
    }
  },
  mounted(){
    this.state.scriptInput = this.$refs['scriptInput']

     this.state.scriptInput.focus()
     window.tv = e => {
     let el;
     (el = document.querySelector('#corbut' + e)).style.display='inline-block'
       let divel = document.querySelector('#cordiv' + e)
       let butel = document.querySelector('#corbut' + e)
       document.querySelectorAll('.cor').forEach(v=>{
         if(v != el){
           v.style.display = 'none'
         }
       })
     }
     window.swp = e => {
       let swptgt = this.state.newTokens[e]
       let out = ''
       for(let i = 0; i < this.state.scriptInput.value.length; ++i){
         let v = this.state.scriptInput.value[i]
         if(i==swptgt.pos){
           let olen = this.state.oldTokens[e].value.length
           out += swptgt.value
           i += olen-1
         }else{
           out += v
         }
       }
       this.state.scriptInput.value = out
       this.processInput()
     }
     window.ob = e => {
       setTimeout(()=>{
         let divel = document.querySelector('#cordiv' + e)
         let butel = document.querySelector('#corbut' + e)
         document.querySelectorAll('.cor').forEach(v=>{
           if(v != divel && v != butel){
             v.style.display = 'none'
           }
         })
         //if((document.activeElement != divel && document.activeElement != butel)) butel.style.display='none'
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
  color: #aaa;;
  width: 100%;
  margin-top: 14px;
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
  top: 17px;
  z-index: 15;
  width: 100%;
  font-family: courier;
  font-size: 14px;
  width: calc(100% - 2px);
  height: calc(100% - 20px);
  left: 3px;
  overflow-y:auto;
  overflow-x: hidden;
  color: #8ffa;
  background: #0000;
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
  color: #6faa;
  background: #4f82;
}
.badClass{
  color: #f00;
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
