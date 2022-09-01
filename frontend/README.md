# chat-app

## Project setup
```
yarn install
```
### Prepare config file

```.env.development``` and ```.env.production```

```
VUE_APP_FIREBASE_API_KEY={your firebase config}
VUE_APP_FIREBASE_AUTH_DOMAIN={your firebase config}
VUE_APP_FIREBASE_PROJECT_ID={your firebase config}
VUE_APP_FIREBASE_STORAGE_BUCKET={your firebase config}
VUE_APP_FIREBASE_MESSAGING_SENDER_ID={your firebase config}
VUE_APP_FIREBASE_APP_ID={your firebase config}
VUE_APP_API_URL={your api url}
```
Here is your firebase config.
If you don't know how to config it, Please check document [Add Firebase to your JavaScript project](https://firebase.google.com/docs/web/setup)



### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```


## How to use

when user login, chat app will auto pop up.


![截圖 2022-09-01 上午9 47 03](https://user-images.githubusercontent.com/18310281/187814801-bcfd73bb-d27a-4c2f-85de-06d57c8d07f0.png)



and here is the chatroom lists page. After cilck the room, will redirect to chat room page

![截圖 2022-09-01 上午9 49 07](https://user-images.githubusercontent.com/18310281/187815020-2c85c609-1f3d-4862-81d6-4e47dbcdf7d8.png)


Finally, we can talk with the other user.
