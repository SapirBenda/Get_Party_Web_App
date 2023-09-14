import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Chip, Icon, Stack, lighten } from "@mui/material";
import { bg, p } from "../General/Theme";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function Comments({ comments }) {
  const dicColors = {
    1: "#ff4545",
    2: "#ffa534",
    3: "#ffe234",
    4: "#57e32c",
    5: "#00DFA2",
  };
  const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon />,
    },
    2: {
      icon: <SentimentDissatisfiedIcon />,
    },
    3: {
      icon: <SentimentSatisfiedIcon />,
    },
    4: {
      icon: <SentimentSatisfiedAltIcon />,
    },
    5: {
      icon: <SentimentVerySatisfiedIcon />,
    },
  };

  const arrays_dic = {
    general_opinipn: ["Terrible", "Poor", "Average", "Good", "Wow"],
    crowdedness: ["Crowded", "Empty", "Spacious", "Just Right"],
    avg_ages: ["18-21", "21-25", "25-30", "30+"],
    waiting_time: ["60+ mins", "30-60 mins", "10-30 mins", "0-10 mins"],
  };

  const mapping = (key, index) => {
    return arrays_dic[key][index - 1];
  };

  const handlePostTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return formattedTime;
  };

  return (
    <List
      sx={{
        overflow: "auto",
        height: "500px",
        flexDirection: "column-reverse",
        display: "flex",
        width: "95%",
        alignItems: "flex-end",
      }}
    >
      {comments &&
        comments?.map((comment) => (
          <ListItem key={comment?.comment_id} sx={{ padding: 0.1 }}>
            <ListItemAvatar sx={{ alignSelf: "flex-end", width: "5%" }}>
              <Avatar src={comment?.avatar} />
            </ListItemAvatar>
            <ListItemText
              sx={{
                height: "auto",
                borderRadius: "1rem 1rem 1rem 0",
                backgroundColor: lighten(bg, 0.1),
                borderLeft: `5px solid ${lighten(bg, 0.3)}`,
              }}
              primary={
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  mt="0.5rem"
                  mx="0.5rem"
                >
                  <Typography variant="cardFontTitle3">
                    {comment?.full_name}{" "}
                  </Typography>
                  <Typography variant="cardFont">
                    {handlePostTime(comment?.post_time)}
                  </Typography>
                </Stack>
              }
              secondary={
                <Stack direction="column">
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    my="0.7rem"
                    mx="0.5rem"
                  >
                    <Typography variant="cardFontTitle">
                      {comment?.content}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    mb="0.5rem"
                    mx="0.5rem"
                    spacing="0.5rem"
                  >
                    <span
                      style={{
                        color: dicColors[comment?.votes?.general_opinion],
                      }}
                    >
                      {customIcons[comment?.votes?.general_opinion].icon}
                    </span>
                    <Typography variant="eventBody3">
                      {mapping(
                        "general_opinipn",
                        comment?.votes?.general_opinion
                      )}
                    </Typography>
                    <GroupsIcon
                      sx={{ color: dicColors[comment?.votes?.crowding] }}
                    />
                    <Typography variant="eventBody3">
                      {mapping("crowdedness", comment?.votes?.crowding)}
                    </Typography>
                    <PersonIcon sx={{ color: p }} />
                    <Typography variant="eventBody3">
                      {mapping("avg_ages", comment?.votes?.average_ages)}
                    </Typography>
                    <AccessTimeIcon
                      sx={{ color: dicColors[comment?.votes?.waiting_time] }}
                    />
                    <Typography variant="eventBody3">
                      {mapping("waiting_time", comment?.votes?.waiting_time)}
                    </Typography>
                  </Stack>
                </Stack>
              }
            />
          </ListItem>
        ))}
    </List>
  );
}
