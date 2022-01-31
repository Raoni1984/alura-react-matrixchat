function EstiloGlobal() {

/*
  Desafios: 

    Customizar o Aluracord com o SEU tema, seu background do assunto favorito (Filmes, Séries, Esportes, o desenho do coração) e compartilhar com a gente!, lembre-se de usar o Coolors que indicamos nesta aula, para gerar a paleta de cores.

    Nosso arquivo de config com a parte das cores para você fazer o seu tema está aqui, use-o como base 
    Customizar o Aluracord com o SEU tema, seu background do assunto favorito (Filmes, Séries, Esportes, o desenho do coração) e compartilhar com a gente!, lembre-se de usar o Coolors que indicamos nesta aula, para gerar a paleta de cores.

*/

    return (
        <style global jsx>
            {`
                 * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    list-style: none;
                  }

                  body {
                    font-family: 'Open Sans', sans-serif;
                  }

                  /* App fit Height */ 
                  html, body, #__next {
                    min-height: 100vh;
                    display: flex;
                    flex: 1;
                  }

                  #__next {
                    flex: 1;
                  }

                  #__next > * {
                    flex: 1;
                  }

                  body {
                      font-family: 'Open Sans', sans-serif;
                  }
            `}

        </style>
    )
}

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <EstiloGlobal />
            <Component {...pageProps} />
        </>
    ) 
  }