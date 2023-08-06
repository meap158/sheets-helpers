// Civitai.gs

/**
 * Retrieves image data from Civitai API and returns the data as a 2D array.
 *
 * @param {number} [limit] - Optional. The maximum number of images to retrieve. If not provided, all images will be retrieved.
 * @param {string} [nsfw] - Optional. Filter to images that contain mature content flags or not.
 *                          Can be one of the following options: "None", "Soft", "Mature", "X".
 *                          If undefined, all images will be returned.
 * @param {string} [sort] - Optional. The order in which you wish to sort the results.
 *                          Can be one of the following options: "Most Reactions", "Most Comments", "Newest".
 * @param {string} [period] - Optional. The time frame in which the images will be sorted.
 *                            Can be one of the following options: "AllTime", "Year", "Month", "Week", "Day".
 * @returns {Array<Array<string|number>>} - A 2D array containing the image data.
 *                                          Each row represents an image and its properties.
 *                                          The first row contains the header names.
 *                                          If any value is not accessible or not provided, it will be an empty string in the array.
 */
function retrieveCivitaiImages(limit, nsfw, sort, period) {
  // Build the base URL
  var baseUrl = "https://civitai.com/api/v1/images";

  // Add optional parameters to the URL if provided
  var isFirstParam = true; // To track if it's the first parameter being added

  if (limit && limit !== "" && limit !== "None") {
    baseUrl += `?limit=${limit}`;
    isFirstParam = false;
  }
  if (nsfw && nsfw !== "") {
    baseUrl += `${isFirstParam ? "?" : "&"}nsfw=${nsfw}`;
    isFirstParam = false;
  }
  if (sort && sort !== "" && sort !== "None") {
    baseUrl += `${isFirstParam ? "?" : "&"}sort=${sort}`;
    isFirstParam = false;
  }
  if (period && period !== "" && period !== "None") {
    baseUrl += `${isFirstParam ? "?" : "&"}period=${period}`;
  }

  // Fetch the data from the URL
  var response = UrlFetchApp.fetch(baseUrl);
  var data = JSON.parse(response.getContentText());
  
  // Extract items array from the data
  var items = data.items;
  
  // Create an array to hold the result data
  var result = [];
  
  // Add headers as the first row in the result array
  result.push([
    "Image URL",
    "Civitai URL",
    "Image Size",
    "😢", // "Cry Count",
    "😂", // "Laugh Count",
    "👍", // "Like Count",
    "👎", // "Dislike Count",
    "❤️", // "Heart Count",
    "💬", // "Comment Count",
    "Prompt",
    "Negative Prompt",
    "ENSD",
    "Size",
    "Seed",
    "Model",
    "Steps",
    "Sampler",
    "cfgScale",
    "Clip Skip"
  ]);
  
  // Loop through each item and retrieve the required values
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    
    // Extract values for the specified keys with error handling
    var id = getSafeValue(item, "id");
    var imageUrl = getSafeValue(item, "url");
    var width = getSafeValue(item, "width");
    var height = getSafeValue(item, "height");
    var cryCount = getSafeValue(item.stats, "cryCount");
    var laughCount = getSafeValue(item.stats, "laughCount");
    var likeCount = getSafeValue(item.stats, "likeCount");
    var dislikeCount = getSafeValue(item.stats, "dislikeCount");
    var heartCount = getSafeValue(item.stats, "heartCount");
    var commentCount = getSafeValue(item.stats, "commentCount");
    var prompt = getSafeValue(item.meta, "prompt");
    var negativePrompt = getSafeValue(item.meta, "negativePrompt");
    var ENSD = getSafeValue(item.meta, "ENSD");
    var Size = getSafeValue(item.meta, "Size");
    var seed = getSafeValue(item.meta, "seed");
    var Model = getSafeValue(item.meta, "Model");
    var steps = getSafeValue(item.meta, "steps");
    var sampler = getSafeValue(item.meta, "sampler");
    var cfgScale = getSafeValue(item.meta, "cfgScale");
    var ClipSkip = getSafeValue(item.meta, "Clip skip");

    var civitaiURL = `https://civitai.com/images/${id}`
    var imageSize = `${width}x${height}`

    // Add the values as a new row in the result array
    result.push([
      imageUrl,
      civitaiURL,
      imageSize,
      cryCount,
      laughCount,
      likeCount,
      dislikeCount,
      heartCount,
      commentCount,
      prompt,
      negativePrompt,
      ENSD,
      Size,
      seed,
      Model,
      steps,
      sampler,
      cfgScale,
      ClipSkip
    ]);
  }

  return result;
}


// Function to safely get the value of a key with error handling
function getSafeValue(obj, key) {
  try {
    return obj[key] || ""; // If the key is not accessible, return an empty string
  } catch (error) {
    return ""; // Return an empty string if there is any error
  }
}
