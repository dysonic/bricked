import { cloneDeep} from 'lodash';
import { getEnhancedCoursingChart } from '../constants/coursingCharts';

export const generate = options => {
  _validateOptions(options);
  const elevation = cloneDeep(options);
  elevation.coursingChart = getEnhancedCoursingChart(options.brickDimension.height);
  _calculateVertical(elevation);
  return elevation;
}

const _validateOptions = options => {
  if (!options.height && !options.numberOfCourses) {
    throw new Error('You must specify either `height` (mm) or `numberOfCourses`');
  }
  if (!options.numberOfBricks && !options.width) {
    throw new Error('You must specify either `width` (mm) or `numberOfBricks`');
  }
};

const _calculateVertical = elevation => {
  if (elevation.height) {
    _calculateVerticalUsingElevationHeight(elevation);
    return;
  }
  _calculateVerticalUsingNumberOfCourses(elevation);
}

const _calculateVerticalUsingElevationHeight = elevation => {
  let { height, coursingChart } = elevation;
  let coursingChartIndex;
  let i = 0;
  let courses = [];
  let cumulativeHeight = 0;
  do {
    coursingChartIndex = i % coursingChart.length;
    const course = { ...coursingChart[coursingChartIndex] };
    if (cumulativeHeight + course.height <= height) {
      cumulativeHeight += course.height;
      course.cumulativeHeight = cumulativeHeight;
      course.n = i + 1;
      courses.push(course);
      i++;
    }
  } while(cumulativeHeight < height);
}

const _calculateVerticalUsingNumberOfCourses = elevation => {
  let { numberOfCourses, coursingChart } = elevation;
  let coursingChartIndex;
  let courses = [];
  let cumulativeHeight = 0;
  for (let i =0; i < numberOfCourses; i++) {
    coursingChartIndex = i % coursingChart.length;
    const course = { ...coursingChart[coursingChartIndex] };
    cumulativeHeight += course.height;
    course.cumulativeHeight = cumulativeHeight;
    course.n = i + 1;
    courses.push(course);
  }
  elevation.height = cumulativeHeight;
}
