function retrieveArtistsData() {
    const baseURL = "https://huggingface.co/spaces/mattthew/SDXL-artists-browser/resolve/main/";
    const scriptUrl = baseURL + "artists_and_tags.js";

    try {
        // Fetch the content of the JavaScript file asynchronously
        const response = UrlFetchApp.fetch(scriptUrl);
        const content = response.getContentText();

        // Find the artistsData array within the content
        const match = content.match(/var artistsData = \[([\s\S]*?)\];/);
        if (!match) {
            Logger.log("artistsData not found in the JavaScript file");
            return [];
        }

        // Extract the artistsData string and split it into individual artist entries
        const artistsDataString = match[1];
        const artistEntries = artistsDataString.split("],");

        // Initialize the array to store artist data, with headers as the first row
        const resultArray = [
            ["Last Name", "First Name", "Tags", "Is Unknown", "Artwork Image URL", "Landscape Image URL", "Portrait Image URL"]
        ];

        // Loop through each artist entry and process the information
        for (const entry of artistEntries) {
            const trimmedEntry = entry.trim();
            if (trimmedEntry.endsWith("]")) {
                trimmedEntry += "]";
            }

            // Custom parsing logic to extract artist data
            const artist = extractArtistData(trimmedEntry);
            if (artist) {
                const [last, first, tags, isUnknown] = artist;

                // Construct image source URLs based on artist name
                const src = baseURL + "images/SDXL_1_0_thumbs/";

                const normalizedLast = last.normalize("NFD");
                const normalizedFirst = first.normalize("NFD");
                const tagsLowerCase = tags.map(tag => tag.toLowerCase()).join(", ");
                const sanitizedTags = tagsLowerCase.replace(/, added-(\d|-)*/g, '');

                const imgArtwork = src + (first === '' ? normalizedLast.replaceAll(' ', '_') : normalizedFirst.replaceAll(' ', '_') + '_' + normalizedLast.replaceAll(' ', '_')) + '-artwork.webp';
                const imgLandscape = imgArtwork.replace('-artwork', '-landscape');
                const imgPortrait = imgArtwork.replace('-artwork', '-portrait');

                const artistInfo = [
                    normalizedLast,
                    normalizedFirst,
                    sanitizedTags,
                    isUnknown,
                    imgArtwork,
                    imgLandscape,
                    imgPortrait
                ];

                resultArray.push(artistInfo);
            }
        }

        return resultArray;
    } catch (error) {
        Logger.log("An error occurred:", error);
        return [];
    }
}


function extractArtistData(entry) {
    var regex = /\[["']([^"']+)["'],["']([^"']*)["'],["']([^"']+)["'](?:,([^,]+))?/;
    var match = entry.match(regex);

    if (match) {
        var last = match[1];
        var first = match[2] ? match[2].replace(/\\'/g, "'") : "";
        var tags = match[3].split("|");
        var isUnknown = match[4] === undefined || match[4] === "false" ? false : true;

        // Handle empty artist names
        if (!last && !first) {
            return null;
        }

        return [last, first, tags, isUnknown];
    } else {
        Logger.log("Error extracting artist data from entry: " + entry);
        return null;
    }
}