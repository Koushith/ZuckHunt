import { FormControl, FormLabel, FormErrorMessage, Input, Button, Container } from "@chakra-ui/react"
import { useState, useEffect } from "react"

import protobuf from "protobufjs";
import {
  createLightNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
  bytesToUtf8,
  Protocols,
  utf8ToBytes
} from "@waku/sdk";

import { backendUrl } from '../../constants'

const ContentTopic = `/zuckhunt/debug1`;
const Encoder = createEncoder({ contentTopic: ContentTopic });
const decoder = createDecoder(ContentTopic);


const ProtoChatMessage = new protobuf.Type("ChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("questName", 2, "string"))
  .add(new protobuf.Field("questHint", 3, "string"));

export const AdminScreen = () => {
  const [questName, setQuestName] = useState('')
  const [questHint, setQuestHint] = useState('')
  const [waku, setWaku] = useState(undefined);
  const [wakuStatus, setWakuStatus] = useState("None");
  // Using a counter just for the messages to be different
  const [sendCounter, setSendCounter] = useState(0);
  const [messages, setMessages] = useState([]);


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

  useEffect(() => {
    if (wakuStatus !== "Connected") return;

    (async () => {
      const startTime = new Date();
      // 7 days/week, 24 hours/day, 60min/hour, 60secs/min, 100ms/sec
      startTime.setTime(startTime.getTime() - 7 * 24 * 60 * 60 * 1000);

      // TODO: Remove this timeout once https://github.com/status-im/js-waku/issues/913 is done
      await new Promise((resolve) => setTimeout(resolve, 200));

      try {
        for await (const messagesPromises of waku.store.queryGenerator(
          [decoder],
          {
            timeFilter: { startTime, endTime: new Date() },
            pageDirection: "forward",
          }
        )) {
          const messages = await Promise.all(
            messagesPromises.map(async (p) => {
              const msg = await p;
              return decodeMessage(msg);
            })
          );

          console.log({messages})
          setMessages((currentMessages) => {
            return currentMessages.concat(messages.filter(Boolean).reverse());
          });
        }
      } catch (e) {
        console.log("Failed to retrieve messages", e);
        setWakuStatus("Error Encountered");
      }
    })();
  }, [waku, wakuStatus]);
  const handleNameChange = (e) => setQuestName(e.target.value)
  const handleHintChange = (e) => setQuestHint(e.target.value)

  //   const isError = input === ''
  return ((
    <Container>

      <FormControl >
        <FormLabel>Name</FormLabel>
        <Input type='text' value={questName} onChange={handleNameChange} />

        <FormErrorMessage>Name is required.</FormErrorMessage>
      </FormControl>
      <FormControl >
        <FormLabel>Hint</FormLabel>
        <Input type='text' value={questHint} onChange={handleHintChange} />

        <FormErrorMessage>Hint is required.</FormErrorMessage>
      </FormControl>
      <Button colorScheme='pink' variant='solid' onClick={async () => {
        if (questHint.length < 3) {
          return alert('Quest Hint reuired')
        }
        if (questName.length < 3) {
          return alert('Quest Name reuired')
        }
        await fetch(backendUrl,{method:'POST',headers: {
            "Content-Type": "application/json",
          },body:JSON.stringify({
            "name": questName,
            "positionData": {
              "lat1": 12973547807205028,
              "lon1": 7501387182542445,
              "lat2": 12973227978507760,
              "lon2": 7500977777251778
            },
            "testInput": {
              "latitude": 12973386619205718,
              "longitude": 7501257511191976
            },
            "hint": questHint
          })})
        sendMessage(questName,questHint, waku).then(() =>
          console.log("Message sent")
        );

        // For demonstration purposes.
        setSendCounter(sendCounter + 1);
      }}>
        Button
      </Button>
    </Container>
  ))



}

function sendMessage(questName,questHint, waku) {
  const timestamp = new Date()
  const time = timestamp.getTime();

  // Encode to protobuf
  const protoMsg = ProtoChatMessage.create({
    timestamp: time,
    questName: questName,
    questHint: questHint,
  });
  const payload = ProtoChatMessage.encode(protoMsg).finish();

  // Send over Waku Relay
  return waku.lightPush.send(Encoder, { payload });
}


function decodeMessage(wakuMessage) {
  if (!wakuMessage.payload) return;

  const { timestamp, questHint, questName } = ProtoChatMessage.decode(
    wakuMessage.payload
  );

  if (!timestamp || !questHint || !questName) return;

  const time = new Date();
  time.setTime(Number(timestamp));

  // const utf8Text = bytesToUtf8(text);

  return {
    questHint: questHint,
    timestamp: time,
    questName: questName,
    timestampInt: wakuMessage.timestamp,
  };
}

function Messages(props) {
  return props.messages.map(({ text, timestamp, nick, timestampInt }) => {
    return (
      <li key={timestampInt}>
        ({formatDate(timestamp)}) {nick}: {text}
      </li>
    );
  });
}

function formatDate(timestamp) {
  return timestamp.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}