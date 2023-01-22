import CommandConfigType from './commandConfigType';
import commandMouseConfig from '../action/mouse/commandMouseConfig';
import commandDrawingConfig from '../action/drawing/commandDrawingConfig';
import commandPrintScreenConfig from '../action/printScreen/commandPrintScreenConfig';

const commandConfig: CommandConfigType = {
  ...commandMouseConfig,
  ...commandDrawingConfig,
  ...commandPrintScreenConfig,
};

export default commandConfig;
