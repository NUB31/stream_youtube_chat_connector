import { getSettings } from "./helpers/config";
import socket from "./helpers/socket";
import { LiveChat } from "youtube-chat";

main();

async function main() {
  const startTime = Date.now();
  console.log("starting in 10 seconds");

  const settings = getSettings();
  const client = new LiveChat({
    handle: settings.YOUTUBE_CHANNEL_NAME,
  });

  client.on("chat", async (messageObject: any) => {
    if (!messageObject.message[0].text || Date.now() - startTime < 10000) {
      return;
    }

    socket.emit(
      "chat/message",
      {
        user: messageObject.author.name,
        message: messageObject.message[0].text,
        color: messageObject.isModerator
          ? "green"
          : messageObject.isMembership
          ? "blue"
          : messageObject.isOwner
          ? "red"
          : messageObject.isVerified
          ? "yellow"
          : "coral",
        badges: [],
        emotes: [],
      },
      async (res: any) => {
        if (!res.message) return;
        console.log(res.message);
      }
    );

    // Remove whitespace from the message
    const message = messageObject.message[0].text.trim();

    // If message is not a command
    if (!(message[0] === "!")) return;

    // Get the command and the command content
    const command = message.toLowerCase().split(" ")[0];
    const content = message.substring(command.length + 1);

    // Do different things based on the command
    switch (command) {
      // Check if user is mod, pauses the playlist after the current song
      case "!pause":
        if (messageObject.isModerator !== true) {
          return socket.emit("music/pause", "", async (res: any) => {
            if (!res.message) return;
            console.log(res.message);
          });
        }
        break;

      // Check if user is mod, resumes the playlist
      case "!resume":
        if (messageObject.isModerator !== true) {
          return socket.emit("music/resume", "", async (res: any) => {
            if (!res.message) return;
            console.log(res.message);
          });
        }
        break;

      // Kills current song
      case "!skip":
        if (messageObject.isModerator !== true) {
          return socket.emit("music/skip", "", async (res: any) => {
            if (!res.message) return;
            console.log(res.message);
          });
        }
        break;

      case "!add":
        // Add a song to the queue
        if (messageObject.isModerator !== true) {
          return socket.emit("music/add", content, async (res: any) => {
            if (!res.message) return;
            console.log(res.message);
          });
        }
        break;

      case "!play":
        // Add the video to the queue after the vid is downloaded (else there could be a problem with playing a non downloaded song)
        return socket.emit("music/play", content, async (res: any) => {
          if (!res.message) return;
          console.log(res.message);
        });

      // If command is not in switch, respond thereafter
      default:
        console.log("not a command");
    }
  });

  try {
    await client.start();
  } catch (err) {
    console.warn(
      "Could not connect. This is probably because of a problem with the username in settings.json."
    );
  }
}
