import React, { useState } from 'react';
//@ts-ignore
import { FormField, PanelOptionsGroup } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { PanelOptions } from './types';

export const MainEditor: React.FC<PanelEditorProps<PanelOptions>> = ({ options, onOptionsChange }) => {
  const [timezone, setTimezone] = useState(options.timezone);

  const onSubmit = () => {
    onOptionsChange({ ...options, timezone });
  };

  return (
    <div className="section gf-form-group">
      <h5 className="section-heading">TimeZone</h5>
      <FormField
        label="TimeZone"
        labelWidth={10}
        inputWidth={40}
        type="text"
        value={timezone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimezone(e.target.value)}
      />
      <button className="btn btn-primary" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};
