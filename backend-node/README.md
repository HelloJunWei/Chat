# NodeJs + express + Typescript


### prepare
Please set up ```serviceKey.json```

```json
{
  "type": {{ your firbase config }},
  "project_id": {{ your firbase config }},
  "private_key_id": {{ your firbase config }},
  "private_key": {{ your firbase config }},
  "client_email": {{ your firbase config }},
  "client_id": {{ your firbase config }},
  "auth_uri": {{ your firbase config }},
  "token_uri": {{ your firbase config }},
  "auth_provider_x509_cert_url": {{ your firbase config }},
  "client_x509_cert_url": {{ your firbase config }}
}
```
That is your firebase-admin config file.
If you don't know how to get it, please check this document: [Add the Firebase Admin SDK to your server](https://firebase.google.com/docs/admin/setup)



### how to start

1. ```npm i``` or ```yarn```
2. ```npm run dev```  or ```yarn dev```

