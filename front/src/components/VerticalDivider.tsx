import { Divider, Grid } from '@mui/material';
import React from 'react';

type Props = {
  contentLeft: JSX.Element;
  contentRight: JSX.Element;
  middleContent: string;
};

function VerticalDivider({
  contentLeft,
  contentRight,
  middleContent,
}: Props): JSX.Element {
  return (
    <Grid container>
      <Grid item xs>
        {contentLeft}
      </Grid>
      <Divider orientation="vertical" flexItem>
        {middleContent}
      </Divider>
      <Grid item xs>
        {contentRight}
      </Grid>
    </Grid>
  );
}

export default VerticalDivider;
