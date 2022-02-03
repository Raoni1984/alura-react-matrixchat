import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

/*
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
    - [X] Lista de mensagens 

    Desafios:
    Paulo: Colocar o botão de OK para enviar a mensagem
    Mario: Colocar um botão de apagar mensagem! Dica: use o filter
    Mario Souto: Mostrar o loading de mensagens (Tem que fazer o mais criativo ein!)
    Paulo Silveira: Fazer um efeito quando passar o mouse em cima (Use esse link como referência: https://pt-br.reactjs.org/docs/events.html#mouse-events)
    Se quiser tentar criar alguma coisa mais diferentona, 
    fique a vontade para criar e compartilhe com a gente :)
*/

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY4NjY5MCwiZXhwIjoxOTU5MjYyNjkwfQ.bXk8rJ5zIQ81h9tKeW2z3xnW7JLGotUOzwtjmvL5Amk";
const SUPABASE_URL = "https://osxjvqhoxprnbnccryot.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listenMessagesInRealTime() {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', () => {
      console.log('Nova Mensagem!');
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        console.log("Dados = ", data);
        setListaDeMensagens(data);
      });

      listenMessagesInRealTime( (novaMensagem) => {

        setListaDeMensagens( (valorAtual) => {
          return (
            [novaMensagem, ...valorAtual]
          );
        });
    
      });

  }, []);

  /* 
    // No modo manual seria usando o Fetch do JS:
    fetch(`${SUPABASE_URL}/rest/v1/mensagens?select=*`, {
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        }
    })
    .then((res) => {
        return res.json();
    });
*/

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      //TODO: Descobrir como passar username de index.js
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([
        //Enviar objeto com os mesmos campos do BD:
        mensagem,
      ])
      .then(({ data }) => {
        console.log("Criando mensagem: ", data);
        // setListaDeMensagens([data[0], ...listaDeMensagens]);
      });

    setMensagem("");
  }

  

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} />
          {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker 
              onStickerClick = { (sticker) => {
                  console.log('Sticker salvo no BD.', sticker);
                  handleNovaMensagem(`:sticker:${sticker}`);
                }
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={
                  mensagem.de != "username"
                    ? `https://github.com/${mensagem.de}.png`
                    : "https://httpstatusdogs.com/img/404.jpg"
                }
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            
            {
              mensagem.texto.startsWith(':sticker:')
              ? (
                  <Image src = { mensagem.texto.replace(':sticker:','') } />
              )
              : (
                  <Text
                    styleSheet={{
                      marginLeft: "10px",
                    }}
                  >
                    {mensagem.texto}
                  </Text>
              )
            }
          </Text>
        );
      })}
    </Box>
  );
}
