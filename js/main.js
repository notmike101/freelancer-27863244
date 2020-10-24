(() => {
  const nativeSpeechRecognition = (() => {
    if ('SpeechRecognition' in window) {
      return SpeechRecognition;
    } else if ('webkitSpeechRecognition' in window) {
      return webkitSpeechRecognition;
    }
    
    return null;
  })();

  async function getWatsonToken() {
    const apiKey = 'a4XP6SFL26U8uHjq124ap9WB-fKYVfC_ZIlVfdbk08I-';
    const realUrl = `https://iam.bluemix.net/identity/token?grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}&response_type=cloud_iam`;
    const corsBypass = 'https://cors-anywhere.herokuapp.com';
    const res = await fetch(`${corsBypass}/${realUrl}`, {
      method: 'POST'
    });

    const json = await res.json();

    return json.access_token;
  }

  if (nativeSpeechRecognition) {
    let savedText = "";
    const target = document.querySelector('#output');

    const recognition = new nativeSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.addEventListener('result', (e) => {
      target.textContent = savedText + e.results[0][0].transcript;
    });
    recognition.addEventListener('end', (e) => {
      savedText = target.textContent + ' ';
      recognition.start();
    });

    document.querySelector('#start').addEventListener('click', () => {
      recognition.start();
    });

    document.querySelector('#stop').addEventListener('click', () => {
      recognition.stop();
    });
  } else {
    let stream = null;

    document.querySelector('#start').addEventListener('click', async () => {
      const token = await getWatsonToken();

      stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
        accessToken: token,
        outputElement: '#output'
      });
      
      stream.recognizeStream.on('message', (frame, data) => {
        console.log('message', frame, data);
      });

      stream.on('error', (err) => {
        console.log(err);
      });
    })

    document.querySelector('#stop').addEventListener('click', () => {
      if (stream) {
        stream.stop();
        stream = null;
      }
    })
  }
})();