class Artist{

	constructor(id, name, subname, descriptionId, themeList){
		this.id = id;
		this.name = name;
		this.subname = subname;
		this.descriptionId = descriptionId || "noDesc";
		this.themeList = themeList || [];
	}

	newTheme(id, name, flag, lyricsId, lyricsTranslateId){

		if (tipo == 0) {

			this.themeList.push(new Theme(id, name, flag, lyricsId, lyricsTranslateId));

		}

		if (tipo == 1) {

			this.themeList.unshift(new Theme(id, name, flag, lyricsId, lyricsTranslateId));

		}

	}

}

class ArtistList{

	constructor(artists){

		this.artists = artists || new Map();

	}

	newArtist(id, name, subname, descriptionId, themeList, tipo = 0){

		if (tipo == 0) {

			this.artists.set(id, new Artist(id, name, subname, descriptionId, themeList));

		}

	}

	insertArtist(artist){

		this.artists.set(artist.id, artist)

	}

	filterList(artistList, filter){

		filter = filter.toUpperCase();

		this.artists.forEach(artist => {artist.name.toUpperCase().includes(filter) || artist.subname.toUpperCase().includes(filter) ? (artistFilterList.insertArtist(artist)) : ""});


	}

}

