import React, { ReactElement } from 'react'
import Select from 'react-select';
// import { ValueType } from 'react-select/src/types'

import { WunderlistList } from '../../types';

interface Option {
  value: number;
  label: string;
}
interface Props {
  options: WunderlistList[];
  selectedList: number;
  setSelectedList: (selectedList: number) => void;
}

export function WunderlistSelect({ options, selectedList, setSelectedList }: Props): ReactElement {
  const values = options.map(x => ({ value: x.id, label: x.title }));
  const selected = values.filter(x => x.value === selectedList)[0];
  return (
    <div>
      <Select
        value={selected}
        onChange={(selectedOption: any) => { 
          if (selectedOption) {
            setSelectedList(selectedOption.value)}
          }}
        options={values}
      />
    </div>
  )
}
