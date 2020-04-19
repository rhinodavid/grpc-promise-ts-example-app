import { JokeClient, JokePromiseClient } from "../jspb/joke_grpc_pb";
import { JokeKind, JokeRequest } from "../jspb/joke_pb";
import { Server, credentials } from "grpc";

import { convertToPromiseClient } from "grpc-promise-ts";
import getPort from "get-port";
import inquirer from "inquirer";
import { startServer } from "./server/server";

const bottomBar = new inquirer.ui.BottomBar();

function getAFace() {
  const faces = [
    "🙃",
    "😋",
    "😇",
    "🤪",
    "🤩",
    "😝",
    "😳",
    "🤮",
    "🤠",
    "👽",
    "😡",
  ];
  return faces[Math.floor(Math.random() * faces.length)];
}

function getFetchingDisplay() {
  return `${getAFace()} 𝕘𝕖𝕥𝕥𝕚𝕟𝕘 𝕪𝕠𝕦𝕣 𝕛𝕠𝕜𝕖 ${getAFace()}`;
}

let jokePromiseClient: JokePromiseClient;
let server: Server;
let port: number;

getPort().then(async (selectedPort) => {
  try {
    port = selectedPort;
    server = await startServer(port);
    jokePromiseClient = convertToPromiseClient(
      new JokeClient(`0.0.0.0:${port}`, credentials.createInsecure())
    );
    await new Promise((resolve, reject) => {
      jokePromiseClient.waitForReady(Date.now() + 10000, (e) => {
        if (e) {
          reject(e);
        }
        resolve();
      });
    });
    const { jokeKind } = await inquirer.prompt({
      type: "list",
      name: "jokeKind",
      message: "❓What kind of joke do you want to hear?",
      choices: [
        { name: "🐶 A dog joke", value: JokeKind.DOG },
        { name: "📱 A text message joke", value: JokeKind.TEXT },
        { name: "😞 A (terrible) pun)", value: JokeKind.PUN },
      ],
    });
    const request = new JokeRequest();
    request.setJokeKind(jokeKind);

    const handle = setInterval(() => {
      bottomBar.updateBottomBar(getFetchingDisplay());
    }, 750);

    const response = await jokePromiseClient.getAJoke(request);
    clearInterval(handle);
    bottomBar.updateBottomBar("");
    console.info("😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆");
    console.info(`\n${response.getJoke()}\n`);
    console.info("😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆");
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
  jokePromiseClient.close();
  server.forceShutdown();
});
