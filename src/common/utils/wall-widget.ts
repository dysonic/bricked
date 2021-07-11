import { UICourse, UIBrick } from '../../features/wall/EditWallContainer';

export const determineSelectedCourseIndexRange = (courses: Array<UICourse>, selectedCourses: Array<UICourse>): Array<number> => {
  let minIndex: number = -1;
  let maxIndex: number = courses.length;

  // Exit early
  if (selectedCourses.length === 0) {
    console.log('determineSelectedCourseIndexRange: no courses selected');
    return [minIndex, maxIndex];
  }

  const selectedCourseIds = selectedCourses.map(c => c.id);
  console.log('determineSelectedCourseIndexRange - selectedCourseIds:', selectedCourseIds);
  courses.forEach((c, i) => {
    if (selectedCourseIds.includes(c.id)) {
      if (minIndex === -1) {
        minIndex = i;
        maxIndex = i;
      }
      else {
        minIndex = Math.min(minIndex, i);
        maxIndex = Math.max(maxIndex, i);
      }
    }
  });

  return [minIndex, maxIndex];
}

export const determineIsSelectCourseDisabled = (courseIndex: number, minIndex: number, maxIndex: number): boolean => {
  const disabled = courseIndex < minIndex - 1 || courseIndex > maxIndex + 1;
  console.log(courseIndex, minIndex, maxIndex, disabled);
  return disabled;
}
