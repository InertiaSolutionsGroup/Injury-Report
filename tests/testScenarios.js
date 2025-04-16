// Test scenarios for injury report AI validation
const testScenarios = [
  {
    name: "Minimal Information",
    description: "Tests how the AI responds when given minimal information in all fields",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Emma Johnson",
      injury_timestamp: new Date().toISOString(),
      location: "Playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Child fell.",
      injury_description: "Scrape on knee.",
      action_taken: "Cleaned it.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Partial Information",
    description: "Tests how the AI responds when some fields are good but others need improvement",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Noah Williams",
      injury_timestamp: new Date().toISOString(),
      location: "Classroom during circle time",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Noah tripped over a toy while walking to his seat.",
      injury_description: "Bruise on arm.",
      action_taken: "Applied ice pack.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Good Information",
    description: "Tests how the AI responds when given good information in all fields",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Sophia Garcia",
      injury_timestamp: new Date().toISOString(),
      location: "Art area in Blue Room",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Sophia slipped on some water that had spilled near the sink during art time.",
      injury_description: "Small red bump on her forehead about the size of a quarter.",
      action_taken: "Applied ice pack for 10 minutes and gave her a hug. She felt better after a few minutes and rejoined the activity.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Bite Incident",
    description: "Tests how the AI handles a bite incident while protecting the biter's identity",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Liam Thompson",
      injury_timestamp: new Date().toISOString(),
      location: "Block area",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Liam was bitten by another child while playing with blocks.",
      injury_description: "Teeth marks visible on left forearm, no broken skin.",
      action_taken: "Washed area with soap and water, applied ice pack.",
      is_bite: true,
      biter_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
      biter_child_name: "Oliver Martinez",
      is_peer_aggression: true,
      aggressor_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
      aggressor_child_name: "Oliver Martinez"
    }
  },
  {
    name: "Peer Aggression",
    description: "Tests how the AI handles peer aggression while protecting the aggressor's identity",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Ava Wilson",
      injury_timestamp: new Date().toISOString(),
      location: "Outdoor playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Ava was pushed by another child on the playground.",
      injury_description: "Scraped her palms when she fell.",
      action_taken: "Washed hands with soap and water, applied bandaids to both palms.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: true,
      aggressor_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
      aggressor_child_name: "Ethan Brown"
    }
  },
  {
    name: "Multiple Injuries",
    description: "Tests how the AI handles multiple injuries in one incident",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Jackson Lee",
      injury_timestamp: new Date().toISOString(),
      location: "Climbing structure on playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Jackson fell from the climbing structure.",
      injury_description: "Scrape on right knee and bump on forehead.",
      action_taken: "Cleaned knee, applied ice to head, monitored for 15 minutes.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Allergic Reaction",
    description: "Tests how the AI handles an allergic reaction incident",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Olivia Chen",
      injury_timestamp: new Date().toISOString(),
      location: "Snack table",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Olivia developed hives after snack time.",
      injury_description: "Red hives on arms and neck, some swelling.",
      action_taken: "Removed from area, called parent, monitored breathing.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Emotional Distress",
    description: "Tests how the AI handles emotional distress without physical injury",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Ethan Rodriguez",
      injury_timestamp: new Date().toISOString(),
      location: "Classroom",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Ethan became upset when his tower fell down.",
      injury_description: "No physical injury, but was crying and upset.",
      action_taken: "Comforted him, helped rebuild tower, redirected to new activity.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Pre-existing Condition",
    description: "Tests how the AI handles an incident involving a pre-existing condition",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Mia Johnson",
      injury_timestamp: new Date().toISOString(),
      location: "Playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Mia's asthma was triggered while running outside.",
      injury_description: "Breathing difficulty, wheezing.",
      action_taken: "Had her sit down, used her inhaler per care plan, monitored breathing.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Delayed Symptoms",
    description: "Tests how the AI handles an incident with delayed symptoms",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Lucas Smith",
      injury_timestamp: new Date().toISOString(),
      location: "Playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Lucas fell during outside time but seemed fine.",
      injury_description: "Later noticed limping, slight swelling on ankle.",
      action_taken: "Applied ice, had him rest, monitored swelling.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Special Needs Consideration",
    description: "Tests how the AI handles an incident involving a child with special needs",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Aiden Taylor",
      injury_timestamp: new Date().toISOString(),
      location: "Sensory area",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Aiden became overwhelmed by noise and hit his head on wall.",
      injury_description: "Small red mark on forehead.",
      action_taken: "Moved to quiet area, applied ice, used calming techniques from his plan.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Toddler Incident",
    description: "Tests how the AI handles an incident with a very young child",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Harper Davis",
      injury_timestamp: new Date().toISOString(),
      location: "Toddler room",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Harper bumped into shelf while learning to walk.",
      injury_description: "Small bump on head.",
      action_taken: "Comforted, applied cold pack, extra cuddles.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  }
];

module.exports = testScenarios;
