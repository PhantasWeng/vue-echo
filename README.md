# Intro
Vue Laravel Echo - Simply import Laravel Echo to Vue instance

- [Intro](#intro)
- [Install](#install)
  - [main.js](#mainjs)
- [Usage](#usage)
  - [In instance](#in-instance)
  - [In router](#in-router)
  - [In Vuex](#in-vuex)
- [API](#api)

# Install

`yarn add @phantasweng/vue-echo`

or

`npm install @phantasweng/vue-echo`

## main.js

```js
import VueEcho from '@/plugins/vue-echo'

Vue.use(VueEcho, {
  broadcaster: 'pusher',
  key: process.env.VUE_APP_ECHO_KEY,
  wsHost: process.env.VUE_APP_ECHO_HOST,
  wsPort: process.env.VUE_APP_ECHO_PORT,
  forceTLS: false,
  disableStats: true,
  authEndpoint: process.env.VUE_APP_ECHO_AUTH,
  auth: { headers: { Authorization: 'Bearer ' + Cookies.get('owlpay_access_token') } }
}, store)

```

# Usage

## In instance

```js
this.$echo.join(channelName, { isPrivate: true })
this.$echo.subscribe(channelName, eventName, (e) => {...})
this.$echo.unsubscribe(channelName, eventName)
```

## In router

```js
import { Echo } from '@/plugins/vue-echo'

Echo.join(channelName, { isPrivate: true })

Echo.subscribe(channelName, eventName, (e) => {...})
Echo.unsubscribe(channelName, eventName)
```

## In Vuex

```js
import { Echo } from '@/plugins/vue-echo'
Echo.join(...)

// OR

this._vm.$echo.join(...)
```

# API
| Name        | Description         |                                                                     |
|-------------|---------------------|---------------------------------------------------------------------|
| join        | 加入 Channel        | function `(channelName, { isPrivate })`                              |
| leave       | 離開 Channel        | function `(channelName)`                                             |
| subscribe   | 訂閱 Event          | function `(channelName, eventName, callback)`                        |
| unsubscribe | 取消訂閱 Event       | function `(channelName, eventName)`                                  |
| getChannels | 取得已加入 Channels  | function                                                             |
| getEvents   | 取得已訂閱 Events    | function 取得全部  OR    function  (channelName)   取得特定 Channel     |
| onChange    | Channel, Event 變動 | 傳入 function，當變動時執行 Hook                                        |
