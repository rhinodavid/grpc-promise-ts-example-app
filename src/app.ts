import { JokeClient, JokePromiseClient } from "../jspb/joke_grpc_pb";
import { JokeKind, JokeRequest } from "../jspb/joke_pb";
import { Server, credentials } from "grpc";

import { convertToPromiseClient } from "grpc-promise-ts";
import { createJokePromiseClient } from "./client/createJokePromiseClient";
import getPort from "get-port";
import inquirer from "inquirer";
import { startServer } from "./server/server";

const bottomBar = new inquirer.ui.BottomBar();

/**
 * Returns a random face emoji. Used to create a dynamic loading indicator
 * while the `getAJoke` request is pending.
 */
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
  // setup server and client
  try {
    port = selectedPort; // `selectedPort` is an available port picked by `getPort`
    server = await startServer(port);
    jokePromiseClient = await createJokePromiseClient(port);
  } catch (e) {
    console.error(`Server/client setup failed: ${e}`);
  }

  try {
    // Setup the CLI
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

    // Use the user's answer to create a request
    const request = new JokeRequest();
    request.setJokeKind(jokeKind);
    // TODO: Once https://github.com/grpc/grpc-node/pull/1370 merges the setter will return the
    // message and the two lines above can be combined

    // Make the animated pending message
    const handle = setInterval(() => {
      bottomBar.updateBottomBar(getFetchingDisplay());
    }, 750);

    // Send our request to the server and get the response
    const response = await jokePromiseClient.getAJoke(request);

    // stop and clear the pending message
    clearInterval(handle);
    bottomBar.updateBottomBar("");

    // show the user their joke
    console.info("😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆");
    console.info(`\n${response.getJoke()}\n`);
    console.info("😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆😆");
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
  // shut down the client and server
  jokePromiseClient.close();
  server.forceShutdown();
});
