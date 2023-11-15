import React from 'react';

import { ChartsHeader, PathogenLineChart } from '../../components';

const PathogenLine = () => (
  <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
   <ChartsHeader category="KOA Predictions" title="Pathogen Monitor" />
    <div className="w-full">
      <PathogenLineChart />
    </div>
  </div>
);

export default PathogenLine;
