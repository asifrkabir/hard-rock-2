const searchSong = async () => {
    const searchText = document.getElementById('search-field').value;
    triggerSlash();
    triggerEnter();
    const url = `https://api.lyrics.ovh/suggest/${searchText}`;

    // load data
    // const res = await fetch(url);
    // const data = await res.json();
    // displaySongs(data.data);

    fetch(url)
        .then(res => res.json())
        .then(data => displaySongs(data.data))
        .catch(error => displayError('Something went wrong! Please try again later!'));

    toggleSpinner();
}

const displaySongs = songs => {
    if (songs.length == 0) {
        displayError('No songs found! Please try again!')
    }
    else {
        const songContainer = document.getElementById('song-container');
        songContainer.innerHTML = '';
        document.getElementById('lyrics-section').innerHTML = '';
        document.getElementById('song-lyrics').innerHTML = '';
        document.getElementById('error-message').innerHTML = '';

        songs.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.className = 'single-result row align-items-center my-3 p-3';
            songDiv.innerHTML = `
            <div class="col-md-9">
                <h3 class="lyrics-name">${song.title}</h3>
                <p class="author lead">Album by <span>${song.artist.name}</span></p>
                <img src="${song.album.cover}" alt="" />
                <audio class="audio-previews mt-3" controls>
                    <source src="${song.preview}" type="audio/mpeg">
                </audio>
            </div>
            <div class="col-md-3 text-md-right text-center mt-4">
                <button onclick="getLyric('${song.artist.name}', '${song.title}')" class="btn blue-btn">Get Lyrics</button>
            </div>
            `;
            songContainer.appendChild(songDiv);
        })

        setVolumeTo10Percent();
    }

    toggleSpinner();
}

// const getLyric = (artist, title) => {
//     const url = `https://api.lyrics.ovh/v1/${artist}/${title}`;

//     fetch(url)
//     .then(res => res.json())
//     .then(data => displayLyrics(data.lyrics, artist, title));
// }

const getLyric = async (artist, title) => {
    const url = `https://api.lyrics.ovh/v1/${artist}/${title}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        displayLyrics(data.lyrics, artist, title);
    } catch (error) {
        document.getElementById('lyrics-section').innerHTML = '';
        document.getElementById('song-lyrics').innerHTML = '';
        displayError('Sorry! Failed to load lyrics! Please try again later!');
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}

const displayLyrics = (lyrics, artist, title) => {
    if (lyrics === undefined) {
        document.getElementById('lyrics-section').innerHTML = '';
        document.getElementById('song-lyrics').innerHTML = '';
        displayError('Sorry! No lyrics found! Please try again later!');
    }
    else{
        document.getElementById('error-message').innerText = '';
        const lyricsSection = document.getElementById('lyrics-section');
        lyricsSection.innerHTML = '';
        const h1 = document.createElement('h1');
        h1.innerText = title;
        const h4 = document.createElement('h4');
        h4.innerText = `by ${artist}`;
        lyricsSection.appendChild(document.createElement('br'));
        lyricsSection.appendChild(h1);
        lyricsSection.appendChild(h4);

        const lyricsDiv = document.getElementById('song-lyrics');
        lyricsDiv.innerText = lyrics;
    }

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

const displayError = (error) => {
    const errorTag = document.getElementById('error-message');
    errorTag.innerText = error;
}

const setVolumeTo10Percent = () => {
    const songs = document.getElementsByClassName('audio-previews');
    Array.from(songs).forEach(song => {
        song.volume = 0.1;
    });
}

const triggerEnter = () => {
    document.getElementById('search-field').addEventListener('keypress', (e) => {
        if (e.code === 'Enter') {
            document.getElementById('search-btn').click();
        }
    })
}

const triggerSlash = () => {
    document.addEventListener('keypress', (e) => {
        if (e.code === 'Slash') {
            document.getElementById('search-field').focus();

            setTimeout(function () {

                document.getElementById('search-field').value = '';

            }, 1);
        }
    })
}

triggerEnter();
triggerSlash();

const toggleSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.toggle('d-none');
}