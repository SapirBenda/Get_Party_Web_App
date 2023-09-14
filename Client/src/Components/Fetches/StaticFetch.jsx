import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import SERVER_PATH from "../General/config";

const getAPI = (url) =>
  fetch(`${SERVER_PATH}/${url}`)
    .then(async (res) => {
      if (res.status === 401 || res.status === 403) {
        await signOut(auth);
        localStorage.removeItem("logged_in");
        window.location.reload();
        return;
      }
      if (!res.ok) {
        console.log(`There was an error in fetching the ${url} API`);
        return [];
      }
      return res.json();
    })
    .catch((error) => {
      console.log("There was an error in fetching the data" + error);
    });

export const getFutureEvents = async () => {
  const response = await getAPI("futureEvents");
  return response ? response : [];
};
export const getTrendingEvents = async () => {
  const response = await getAPI("trendingEvents");
  return response ? response : [];
};
export const getFollowedProductionsEvents = async (user_id, token_id) => {
  const url = `followedProductionsEvents?user_id=${user_id}&token_id=${token_id}`;
  const response = getAPI(url);
  return response ? response : [];
};

export const getSuggestedEvents = async (user_id, token_id) => {
  const url = `suggestedEvents?user_id=${user_id}&token_id=${token_id}`;
  const response = getAPI(url);
  return response ? response : [];
};

/***** Production Page APIs *****/
export const getProductionDetails = async (production_id) => {
  const response = await getAPI(`productionInfo?user_id=${production_id}`);
  return response ? response : [];
};

export const getEventDetails = async (event_id) => {
  const response = await getAPI(`event?event_id=${event_id}`);
  return response ? response : [];
};

export const getPastEvents = async (production_id) => {
  const response = await getAPI(`pastEvents?production_id=${production_id}`);
  return response ? response : [];
};

export const getFutureEventOfProduction = async (production_id) => {
  const response = await getAPI(
    `futureEventsByProduction?production_id=${production_id}`
  );
  return response ? response : [];
};

export const getIsFollowed = async (user_id, production_id, token_id) => {
  const response = user_id && production_id && token_id ? await getAPI(
    `isFollowed?user_id=${user_id}&production_id=${production_id}&token_id=${token_id}`
  ) : null;
  return response ? response : [];
};

export const getIsLiked = async (user_id, event_id, token_id) => {
  const response = user_id && event_id && token_id ? await getAPI(
    `isLiked?user_id=${user_id}&event_id=${event_id}&token_id=${token_id}`
  ): null;
  return response ? response : [];
};

export const getIsRanked = async (user_id, production_id, token_id) => {
  const response = await getAPI(
    `isRanked?user_id=${user_id}&production_id=${production_id}&token_id=${token_id}`
  );
  return response ? response : [];
};
export const getRank = async (production_id) => {
  const response = await getAPI(`getRank?production_id=${production_id}`);
  return response ? response : [];
};

export const getNumberOfFollowers = async (production_id) => {
  const response = await getAPI(
    `numberOfFollowers?production_id=${production_id}`
  );
  return response ? response : [];
};

export const postFollow = async (params) => {
  const { user_id, production_id, token_id, setOpen } = params;
  await fetch(
    `${SERVER_PATH}/follow?user_id=${user_id}&production_id=${production_id}&&token_id=${token_id}`,
    {
      method: "POST",
      headers: { "content-Type": "application/json" },
    }
  )
    .then(async (response) => {
      /* if the BE verification failed - signuot and open the signIn pop up*/
      if (response.status === 401) {
        await signOut(auth);
        localStorage.removeItem("logged_in");
        // alert("Error: Session expired please reauthenticate")
        setOpen(true);
        return;
      }
      if (!response.ok) {
        return [];
      }
    })
    .catch((error) => {
      console.log("There was error with liking/following the event", error);
    });
};

export const postLike = async (params) => {
  const { user_id, event_id, token_id, setOpen } = params;
  await fetch(
    `${SERVER_PATH}/like?user_id=${user_id}&event_id=${event_id}&&token_id=${token_id}`,
    {
      method: "POST",
      headers: { "content-Type": "application/json" },
    }
  )
    .then(async (response) => {
      /* if the BE verification failed - signuot and open the signIn pop up*/
      if (response.status === 401) {
        await signOut(auth);
        localStorage.removeItem("logged_in");
        // alert("Error: Session expired please reauthenticate")
        setOpen(true);
        return;
      }
      if (!response.ok) {
        return [];
      }
    })
    .catch((error) => {
      console.log("There was error with liking/following the event", error);
    });
};

export const postRank = async (params) => {
  const { user_id, production_id, new_rank, token_id, setOpen } = params;
  await fetch(
    `${SERVER_PATH}/updateRank?user_id=${user_id}&production_id=${production_id}&new_rank=${new_rank}&token_id=${token_id}`,
    {
      method: "POST",
      headers: { "content-Type": "application/json" },
    }
  )
    .then(async (response) => {
      /* if the BE verification failed - signuot and open the signIn pop up*/
      if (response.status === 401 || response.status === 403) {
        await signOut(auth);
        localStorage.removeItem("logged_in");
        setOpen(true);
        return;
      }
      if (!response.ok) {
        console.log("There was an Error in posting the rank");
        return;
      }
    })
    .catch((error) => {
      console.log("There was error with liking/following the event", error);
    });
};

/***** Production Page APIs *****/

/***** List Fetch APIs *****/
const getListAPI = (url) =>
  fetch(`${SERVER_PATH}/${url}`)
    .then((res) => {
      if (!res.ok) {
        console.log("=========================")
        console.log(`There was error fetching the list of ${url}`);
        return [];
      }
      return res.json();
    })
    .catch((error) => {
      console.log("There was an error in fetching lists" + error);
    });

export const getPlaceTypes = async () => {
  const response = await getListAPI("placeTypes");
  return response ? response : [];
};
export const getMusicTypes = async () => {
  const response = await getListAPI("musicTypes");
  return response ? response : [];
};
export const getProductions = async () => {
  const response = await getListAPI("getAllProductions");
  return response ? response : [];
};
export const getRegions = async () => {
  const response = await getListAPI("Regions");
  return response ? response : [];
};
/***** List Fetch APIs *****/

/***** Search API *****/
const getResultsAPI = (filters) =>
  fetch(
    `${SERVER_PATH}/search?data=${encodeURIComponent(
      JSON.stringify(filters)
    )}`
  )
    .then((results) => {
      if (!results.ok) {
        console.log("There was error fetching the results for the search");
        return [];
      }
      return results.json();
    })
    .catch((error) => {
      console.log("There was error in search query" + error);
    });

export const getResults = async (filters) => {
  const response = await getResultsAPI(filters);
  return response ? response : [];
};
/***** Search API *****/

/***** Profile APIs *****/
const getProfileAPI = (url) =>
  fetch(`${SERVER_PATH}/${url}`)
    .then(async (response) => {
      /* if the BE verification failed - signout, alert the user and navigate to Home */
      if (response.status === 401) {
        await signOut(auth);
        localStorage.removeItem("logged_in");
        alert("Error: authorization failed");
        navigate("/");
      }
      if (response.status === 403) {
        await signOut(auth);
        localStorage.removeItem("logged_in");
        alert("Error: session ended - please sign in again");
      }
      if (!response.ok) {
        console.log("There was error fetching the profile data");
        return [];
      }
      return response.json();
    })
    .catch((error) =>
      console.log(
        "There was an error in fetching data on the profile page",
        error
      )
    );

export const getFollowedProductions = async (user_id, token_id) => {
  const response = await getProfileAPI(
    `productionsFollowed?user_id=${user_id}&token_id=${token_id}`
  );
  return response ? response : [];
};
export const getLikedEvents = async (user_id, token_id) => {
  const response = await getProfileAPI(
    `likedEvents?user_id=${user_id}&token_id=${token_id}`
  );
  return response ? response : [];
};

export const getUserPreferences = async (user_id, token_id) => {
  const response = await getProfileAPI(
    `getPreferences?user_id=${user_id}&token_id=${token_id}`
  );
  return response ? response : [];
};
/***** Profile APIs *****/

/***** Live Mode fetch *****/
const getLiveModeAPI = async (url) =>
  await fetch(`${SERVER_PATH}/${url}`)
    .then(async (response) => {
      if (!response.ok) {
        console.log("There was error fetching the live mode data");
        return [];
      }
      return response.json();
    })
    .catch((error) =>
      console.log(
        "There was an error in fetching the data on the Live Mode page" + error
      )
    );
export const getAllComments = async (event_id) => {
  const response = await getLiveModeAPI(`getAllComments?event_id=${event_id}`);
  return response ? response : [];
};

export const getVotes = async (event_id) => {
  const response = await getLiveModeAPI(`getVotes?event_id=${event_id}`);
  return response ? response : [];
};

export const getLiveImages = async (event_id) => {
  const response = await getLiveModeAPI(`getAllPhotos?event_id=${event_id}`);
  return response ? response : [];
};

export const getEventTime = async (event_id) => {
  const response = await getLiveModeAPI(
    `getStartTimeStamp?event_id=${event_id}`
  );
  return response ? response : [];
};

const getEventDetailsForUpdate = async (url) => {
  await fetch(`${SERVER_PATH}/${url}`)
    .then(async (response) => {
      if (!response.ok) {
        console.log("There was error fetching the detauls for updating event");
        return [];
      }
      return response.json();
    })
    .catch((error) =>
      console.log(
        "There was an error in fetching the data on the event page" + error
      )
    );
};
export const getEventDetailsUpdate = async (event_id, user_id, token_id) => {
  const response = await getEventDetailsForUpdate(
    `eventForUpdate?event_id=${event_id}&user_id=${user_id}&token_id=${token_id}`
  );
  return response ? response : [];
};
