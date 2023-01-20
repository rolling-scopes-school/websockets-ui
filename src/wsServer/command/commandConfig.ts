import CommandConfigType from './commandConfigType';
import commandMouseConfig from '../action/mouse/commandMouseConfig';
import commandDrawingConfig from '../action/drawing/commandDrawingConfig';

const commandConfig: CommandConfigType = {
  ...commandMouseConfig,
  ...commandDrawingConfig,
  // prnt_scrn
};

export default commandConfig;
