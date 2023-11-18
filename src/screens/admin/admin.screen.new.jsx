

import { backendUrl } from '../../constants'
import protobuf from "protobufjs";
import { useState, useEffect } from "react"
import {
  createLightNode,
  createEncoder,
  waitForRemotePeer,
  Protocols,
} from "@waku/sdk";


const ContentTopic = `/zuckhunt/debug6`;
const Encoder = createEncoder({ contentTopic: ContentTopic });
import Geohash  from 'latlon-geohash';
import { Button,Container } from '@chakra-ui/react';



export const ProtoQuestData = new protobuf.Type("QuestData")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("questName", 2, "string"))
  .add(new protobuf.Field("questHint", 3, "string"))
  .add(new protobuf.Field("questHash", 4, "string"))
  .add(new protobuf.Field("questSalt", 5, "string"))
  .add(new protobuf.Field("questAtrName", 6, "string"))
  .add(new protobuf.Field("questAtrType", 7, "string"))
  .add(new protobuf.Field("questAtrImg", 8, "string"));

  const salterStrig = '0123456789bcdefghjkmnpqrstuvwxyz'
  function makeSalt(length) {
    let result = '';

    const charactersLength = salterStrig.length;
    let counter = 0;
    while (counter < length) {
        result += salterStrig.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export const AdminScreenNew = () => {
  const [waku, setWaku] = useState(undefined);
  const [wakuStatus, setWakuStatus] = useState("None");
  

  useEffect(() => {
    if (wakuStatus !== "None") return;

    setWakuStatus("Starting");

    createLightNode({ defaultBootstrap: true }).then((waku) => {
      waku.start().then(() => {
        setWaku(waku);
        setWakuStatus("Connecting");
      });
    });
  }, [waku, wakuStatus]);

  useEffect(() => {
    if (!waku) return;

    // We do not handle disconnection/re-connection in this example
    if (wakuStatus === "Connected") return;

    waitForRemotePeer(waku, [ Protocols.LightPush,
      Protocols.Filter,Protocols.Store]).then(() => {
      // We are now connected to a store node
      setWakuStatus("Connected");
    });
  }, [waku, wakuStatus]);


  return ((
    <Container>

<h1>{wakuStatus}</h1>
      <Button colorScheme='pink' variant='solid' onClick={async () => {
        if (!waku) return alert("wait for waku init");
        const data = [
          {questAtrName : "glasses-deep-teal",questAtrType:"glasses",questAtrImg:"glasses-deep-teal.png",hint:"Decentralized creativity meets ancient charm at the crossroads of East and West."},
          {questAtrName : "bg-cool",questAtrType:"bg",questAtrImg:"bg-cool.png",hint:"Unleash your coding magic where continents collide."},
          {questAtrName : "accessory-bling-anvil",questAtrType:"accessory",questAtrImg:"accessory-bling-anvil.png",hint:"Hack the Bosphorus breeze with your blockchain brilliance."},
          {questAtrName : "body-peachy-B",questAtrType:"body",questAtrImg:"body-peachy-B.png",hint:"Innovate where history and technology intertwine."},
          {questAtrName : "head-beluga.png",questAtrType:"head",questAtrImg:"head-beluga.png.png",hint:"Elevate your code amidst the echoes of Byzantine brilliance."        }
        ]
        data.forEach( async (d) => {
          const name = `Quest For  ${d.questAtrName.toUpperCase()}`
          
          const lat = 41.0477
          const lon = 28.987
          const geohash = Geohash.encode(lat,lon,6)
          const salt = makeSalt(8)
          const geohashExt = geohash + salt
          const geoHashExtIntArray = geohashExt.split('')
          const saltCharArray = salterStrig.split('')
          const geoHashExtIntArrayEncoded = geoHashExtIntArray.map(e => saltCharArray.indexOf(e))
          const hashRes = await fetch(`${backendUrl}`,{method:"POST",body: JSON.stringify({data:geoHashExtIntArrayEncoded }),headers:{
            "Content-Type": "application/json",
          }})
          const hashResData = await hashRes.json()
          const hash = hashResData.data
          if (wakuStatus !== "Connected") return alert("wait for waku conect"+wakuStatus);
          await sendMessage(name,d.hint,hash,salt,d.questAtrName,d.questAtrType,d.questAtrImg, waku)
        })
        alert("sent")
        
      }}>
        Button
      </Button>
      <Button colorScheme='pink' variant='solid' onClick={async () => {
        const snarkjs = window.snarkjs;
        const {proof, publicSignals} = await snarkjs.groth16.fullProve({ "in": ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],  "hash": "16247148725799187968432601021479716680539182929063252906051522933915398361998" }, "circuit.wasm", "circuit_0000.zkey")
        console.log({ proof, publicSignals })
       
        
      }}>
        Proof
      </Button>
    </Container>
  ))



}

function sendMessage(questName,questHint,questHash,questSalt,questAtrName,questAtrType,questAtrImg, waku) {
  const timestamp = new Date()
  const time = timestamp.getTime();
  // Encode to protobuf
  const protoMsg = ProtoQuestData.create({
    timestamp: time,
   questName,questHint,questHash,questSalt,questAtrName,questAtrType,questAtrImg
  });
  const payload = ProtoQuestData.encode(protoMsg).finish();

  // Send over Waku Relay
  return waku.lightPush.send(Encoder, { payload });
}


// function decodeMessage(wakuMessage) {
//   if (!wakuMessage.payload) return;

//   const { timestamp, questHint, questName } = ProtoChatMessage.decode(
//     wakuMessage.payload
//   );

//   if (!timestamp || !questHint || !questName) return;

//   const time = new Date();
//   time.setTime(Number(timestamp));

//   // const utf8Text = bytesToUtf8(text);

//   return {
//     questHint: questHint,
//     timestamp: time,
//     questName: questName,
//     timestampInt: wakuMessage.timestamp,
//   };
// }

// function Messages(props) {
//   return props.messages.map(({ text, timestamp, nick, timestampInt }) => {
//     return (
//       <li key={timestampInt}>
//         ({formatDate(timestamp)}) {nick}: {text}
//       </li>
//     );
//   });
// }

// function formatDate(timestamp) {
//   return timestamp.toLocaleString([], {
//     month: "short",
//     day: "numeric",
//     hour: "numeric",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });
// }