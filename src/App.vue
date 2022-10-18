<template>
  <Main :state="state"/>
</template>

<script>
import Main from './components/Main.vue'
var l
export default {
  name: 'App',
  components: {
    Main
  },
	data(){
		return {
			state: {
				headerText: 'throw some c0d3z    (js)',
        baseURL: 'https://'+window.location.hostname,
        baseDemoURL: 'https://demo.'+(l=window.location.hostname.split('.')).filter((v,i)=>i>l.length-3).join('.'),
        rootDomain: window.location.hostname,
				scriptInput: null,
				tokens: [],
				newTokens: [],
				oldTokens: [],
			}
		}
	}
}
</script>

<style>
body, html{
  margin: 0;
  background: #000;
  color: #fff;
	overflow: hidden;
  font-family: courier;
  font-size: 14px;
}
</style>
