import { useBackend, useLocalState } from '../backend';
import { Flex, Tabs, NoticeBox, Fragment, Button, Section, Box, LabeledList, ColorBox, Input } from '../components';
import { Window } from '../layouts';

export const idConsole = (props, context) => {
  const { act, data } = useBackend(context);

  const {
    messages = [],
    command_name,
    time,
    regions = [],
  } = data;

  // const access_data = Object.keys(data.access_data);

  let authenticated = false;

  return (
    <Window
      width={600}
      height={700}
    >
      <Window.Content>
        <Section
          title="- - - - -"
          buttons={(
            <Button
              icon={authenticated ? "sign-out-alt" : "sign-in-alt"}
              content={authenticated ? "Log Out" : "Log In"}
              color={authenticated ? "bad" : "good"}
              onClick={() => {
                act(authenticated ? 'PRG_logout' : 'PRG_authenticate');
              }} />
          )}
        >
          <Button
            icon="eject"
            fontSize="1.15rem"
            fluid
            px="1rem"
            py=".25rem"
          >
            identification card
          </Button>
        </Section>

        {/* {regions.map((region, i) => { return (
          <Box key={i}>
            {region.name}

            <Box>
              <Flex wrap="wrap" justify="space-between">
                {Object.keys(region.accesses).map((region_access) => { return (
                  <Flex.Item
                    key={0}
                    width="49%"
                  >

                    <Button
                      width="100%"
                      py=".5rem"
                      mb=".5rem"
                      content={region.accesses[region_access] + " (" + region_access + ")"} />
                  </Flex.Item>
                ); })}
              </Flex>
            </Box>
          </Box>
        ); })} */}


        {/* {Object.keys(data.access_data).map((area_id) => { return (
          <Box key={area_id}>
            {area_id}
            {data.access_data[area_id]}
          </Box>
        ); })} */}


        {/* <accessSettings /> */}
        <FeatureBanTabs />
      </Window.Content>
    </Window>
  );
};

const FeatureBanTabs = (props, context) => {
  const { data } = useBackend(context);
  const [jobbanTab, setJobbanTab] = useLocalState(context, 'jobbanTab', 0);
  return (
    <Flex>
      <Flex.Item>
        <Section fitted>
          <Tabs vertical>
            {data.regions.map((region, i) => { return (
              <Tabs.Tab
                key={i}
                color={"red"}
                py=".5rem"
                selected={jobbanTab === i}
                onClick={() => setJobbanTab(i)}
              >
                {region.name}
              </Tabs.Tab>
            ); })}
          </Tabs>
        </Section>
      </Flex.Item>

      <Flex.Item grow>
        <FeatureBans />
      </Flex.Item>
    </Flex>
  );
};

const FeatureBans = (props, context) => {
  const { act, data } = useBackend(context);
  const [jobbanTab] = useLocalState(context, 'jobbanTab', 0);
  const { roles, regions } = data;
  return (
    <Section fill>
      <Section
        title={data.regions[jobbanTab].name}
        buttons={(
          <Fragment>
            <Button
              content="Grant region"
              color="good"
              icon="check"
              minWidth="8rem"
              textAlign="center"
              onClick={() => act("job_ban", {
                selected_role: roles[jobbanTab].category_name,
                is_category: true,
              })} />
            <Button
              content="Deny region"
              color="bad"
              icon="times"
              minWidth="8rem"
              textAlign="center"
              onClick={() => act("job_ban", {
                selected_role: roles[jobbanTab].category_name,
                is_category: true,
                want_to_ban: true,
              })} />
          </Fragment>
        )}
      >
        <Flex wrap="wrap" justify="space-between">
          {Object.keys(regions[jobbanTab].accesses).map((access) => { return (
            <Flex.Item
              key={0}
              width="49%"
            >

              <Button.Checkbox
                width="100%"
                py=".5rem"
                mb=".5rem"
                checked={access % 2}
                content={regions[jobbanTab].accesses[access]}
                onClick={() => act("job_ban", {
                  selected_role: role.name,
                  want_to_ban: (role.ban_reason ? false : true),
                })} />
            </Flex.Item>
          ); })}

        </Flex>
      </Section>
    </Section>
  );
};

const accessSettings = (props, context) => {
  const { act, data } = useBackend(context);
  const [jobbanTab] = useLocalState(context, 'jobbanTab', 0);
  const { roles, antag_ban_reason } = data;
  return (
    <Section fill>
      <Section
        title={roles[jobbanTab].category_name}
        buttons={(
          <Fragment>
            <Button
              content="Unban All"
              color="good"
              icon="lock-open"
              minWidth="8rem"
              textAlign="center"
              onClick={() => act("job_ban", {
                selected_role: roles[jobbanTab].category_name,
                is_category: true,
              })} />
            <Button
              content="Ban All"
              color="bad"
              icon="lock"
              minWidth="8rem"
              textAlign="center"
              onClick={() => act("job_ban", {
                selected_role: roles[jobbanTab].category_name,
                is_category: true,
                want_to_ban: true,
              })} />
          </Fragment>
        )}
      >
        <Flex wrap="wrap" justify="space-between">
          {roles[jobbanTab].category_name === "Antagonists" && (
            <NoticeBox
              width="100%"
              danger={antag_ban_reason ? true : false}
            >
              <Flex justify="space-between" align="center">
                <Flex.Item width="100%">
                  This player is {antag_ban_reason ? "" : "not"} antagonist banned
                </Flex.Item>
                <Flex.Item>
                  <Button
                    align="right"
                    ml=".5rem"
                    px="2rem"
                    py=".5rem"
                    color={antag_ban_reason ? "orange" : ""}
                    tooltip={antag_ban_reason ? "Reason: " + antag_ban_reason : ""}
                    content={antag_ban_reason ? "Unban" : "Ban"}
                    onClick={() => act("job_ban", {
                      selected_role: "Syndicate",
                      want_to_ban: (antag_ban_reason ? false : true),
                    })}
                  />
                </Flex.Item>
              </Flex>
            </NoticeBox>
          )}

          {roles[jobbanTab].category_roles.map((role) => { return (
            <Flex.Item
              key={0}
              width="49%"
            >

              <Button
                width="100%"
                py=".5rem"
                mb=".5rem"
                icon={role.ban_reason ? "lock" : "lock-open"}
                color={role.ban_reason ? "bad" : "transparent"}
                tooltip={role.ban_reason ? "Reason: " + role.ban_reason : ""}
                content={role.name}
                onClick={() => act("job_ban", {
                  selected_role: role.name,
                  want_to_ban: (role.ban_reason ? false : true),
                })} />
            </Flex.Item>
          ); })}

        </Flex>
      </Section>
    </Section>
  );
};
