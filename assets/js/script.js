const base_url =  "https://mp3quran.net/api/v3";
const language = "ar";

async function get_data(){
    const chooseRiceter = document.querySelector("#chooseRiceter");

    let rsponse = await fetch(`${base_url}/reciters?language=${language}`);
    let data = await rsponse.json();
    // console.log(data);

    chooseRiceter.innerHTML = `<option value="">اختر قارئ</option>`;
    data.reciters.forEach(reciter => {
        chooseRiceter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
    });
    chooseRiceter.addEventListener("change", e=> get_moshaf(e.target.value));
}
get_data();

async function get_moshaf(reciter){
    const chooseRewayah = document.querySelector("#chooseRewayah");

    let response = await fetch(`${base_url}/reciters?language=${language}&reciter=${reciter}`);
    let data = await response.json();
    let rewayat = data.reciters[0].moshaf;
    chooseRewayah.innerHTML = `<option value= data-server= data-surahList=>اختر مصحف</option>`;
        for (let j = 0; j < rewayat.length; j++) {
            chooseRewayah.innerHTML += `<option value=${rewayat[j].id} data-server=${rewayat[j].server} data-surahList=${rewayat[j].surah_list} >${rewayat[j].name}</option>`;
        }
    chooseRewayah.addEventListener("change", e =>{
        const selectedRewayah = chooseRewayah.options[chooseRewayah.selectedIndex];
        const surah_server = selectedRewayah.dataset.server;
        const surah_list = selectedRewayah.dataset.surahlist;
        get_suwar(surah_server, surah_list);
    });
}

async function get_suwar(surah_server, surah_list){
    const chooseSurah = document.querySelector("#chooseSurah");
    console.log(surah_server)

    const response = await fetch(`${base_url}/suwar`);
    const data = await response.json();
    const surah_names = data.suwar;

    chooseSurah.innerHTML = `<option value="">اختر سورة</option>`;
    surah_list = surah_list.split(",");
    surah_list.forEach(surah =>{
        const pad_surah = surah.padStart(3,"0");
        surah_names.forEach(surah_name =>{
            if (surah_name.id == surah) {
                chooseSurah.innerHTML += `<option value="${surah_server}${pad_surah}.mp3">${surah_name.name}</option>`
            }
        });
    });

    chooseSurah.addEventListener("change", e =>{
        const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
        play_surah(selectedSurah.value);
    });
}
function play_surah(surah_mp3){
    const audio_player = document.querySelector("#audio-player");
    audio_player.src = surah_mp3;
    audio_player.play();
}
function playLive(channel) {
    if(Hls.isSupported()) {
        var video = document.getElementById('live-video');
        var hls = new Hls();
        hls.loadSource(channel);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
      });
     }
}