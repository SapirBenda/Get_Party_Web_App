import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { s } from "../../Components/General/Theme";
import ImageCarousel from "../../Components/ImageDisplay/ImageCarousel";
import Search from "./Search";
import { UserAuth } from "../../Components/General/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import {
  getFollowedProductionsEvents,
  getFutureEvents,
  getSuggestedEvents,
  getTrendingEvents,
} from "../../Components/Fetches/StaticFetch";

export default function Home() {
  const { currentUser, getTokenId } = UserAuth();

  /* Fetch user's token ID */
  const { data: token_id = null } = useQuery({
    queryKey: ["tokenId"],
    queryFn: getTokenId,
    enabled:  Boolean(currentUser),
  });

  /* Fetch all the future events on the website */
  const { data: futureEvents = [] } = useQuery({
    queryKey: ["futureEvents"],
    queryFn: () => getFutureEvents(),
    placeholderData: [],
  });

  /* Fetch all the trending events on the website */
  const { data: trendingEvents = [] } = useQuery({
    queryKey: ["trendingEvents"],
    queryFn: () => getTrendingEvents(),
    placeholderData: [],
  });

  /* Fetch all the events that the user follows their production */
  const { data: followedProductionsEvents = [] } = useQuery({
    queryKey: ["followedProductionsEvents"],
    queryFn: () => getFollowedProductionsEvents(currentUser?.user_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser) ,
    placeholderData: [],
  });

  /* Fetch the events based on the user's preferences */
  const { data: suggestedEvents = [] } = useQuery({
    queryKey: ["suggestedEvents"],
    queryFn: () => getSuggestedEvents(currentUser?.user_id, token_id),
    enabled: Boolean(token_id) && Boolean(currentUser),
    placeholderData: [],
  });

  return (
    <Stack direction="column" alignItems="center">
      <Stack width="98%">
        <Search />
      </Stack>
      <Stack direction="column" width="98%" justifyContent="center">
        <Stack marginTop="3rem" marginLeft="2rem">
          <Typography variant="listTitle">Trending Events</Typography>
        </Stack>
        <Divider sx={{ backgroundColor: s, width: "96.5%", mx: "2rem" }} />
        <ImageCarousel elements={trendingEvents} />

        {followedProductionsEvents && followedProductionsEvents.length > 0 && (
          <>
            <Stack marginTop="1rem" marginLeft="2rem">
              <Typography variant="listTitle">
                Followed Productions Events
              </Typography>
            </Stack>
            <Divider sx={{ backgroundColor: s, width: "96.5%", mx: "2rem" }} />
            <ImageCarousel elements={followedProductionsEvents} />
          </>
        )}

        {suggestedEvents && suggestedEvents.length > 0 && (
          <>
            <Stack marginTop="1rem" marginLeft="2rem">
              <Typography variant="listTitle">You Might Like</Typography>
            </Stack>
            <Divider sx={{ backgroundColor: s, width: "96.5%", mx: "2rem" }} />
            <ImageCarousel elements={suggestedEvents} />
          </>
        )}

        <Stack marginTop="1rem" marginLeft="2rem">
          <Typography variant="listTitle">All Events</Typography>
        </Stack>
        <Divider sx={{ backgroundColor: s, width: "96.5%", mx: "2rem" }} />

        <ImageCarousel elements={futureEvents} />
      </Stack>
    </Stack>
  );
}
