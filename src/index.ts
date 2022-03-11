import chalk from "chalk";
import cors from "fastify-cors";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import fastifyStatic from "fastify-static";

const { pathname: root } = new URL("../public", import.meta.url);

const server = fastify();
server.register(fastifyIO);
server.register(cors, {
  origin: true,
});
server.register(fastifyStatic, {
  root,
  prefix: "/",
});

server.get("/", async (_req, reply) => {
  server.io.emit("hello", "test");
  return reply.sendFile("index.html");
});

server.ready().then(() => {
  server.io.on("connection", (socket) => {
    const chain = "simon busques chupa ano";
    let counter = 0;

    console.log("Se ha conectado el id:", chalk.yellow(socket.id));

    socket.emit("chain", chain);

    socket.on("keypress", (caracter) => {
      if (chain[counter] === caracter) {
        const newCounter = counter + 1;
        if (newCounter < chain.length) {
          counter = newCounter;
        } else {
          // chain completada, se suman +X puntos
          socket.emit("win");
          console.log(chalk.green("El ganador es el id", socket.id));
        }
      } else {
        // penalty
        // se restan puntos por cada tecla incorrecta
      }
    });
  });
});

server.listen(3000);

console.log("Running on: http://localhost:3000");
