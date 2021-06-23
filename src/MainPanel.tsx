import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame } from 'types';
import { ResponsiveBar } from '@nivo/bar';
import { processData, formatTick, formalFullEpoch } from './util/process';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: Array<{ [key: string]: any }>;
  keys: Array<string>;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    data: [],
    keys: [],
  };

  componentDidMount() {
    const series = this.props.data.series as Frame[];
    if (series.length == 0) return;

    const { data, keys } = processData(series);
    this.setState({ data, keys });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series != this.props.data.series) {
      if (this.props.data.series.length == 0) {
        this.setState({ data: [], keys: [] });
        return;
      }
      const series = this.props.data.series as Frame[];

      const { data, keys } = processData(series);
      this.setState({ data, keys });
    }
  }

  render() {
    const {
      width,
      height,
      options: { timezone },
    } = this.props;
    const { data, keys } = this.state;

    if (data.length == 0) return <div>No Data</div>;

    return (
      <div
        style={{
          width,
          height,
        }}
      >
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy="timestamp"
          margin={{ top: 50, right: 130, bottom: 50, left: 80 }}
          padding={0.3}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            renderTick: (tick: any) => {
              return (
                <g transform={`translate(${tick.x},${tick.y + 22})`}>
                  <line stroke="#ccc" strokeWidth={1.5} y1={-22} y2={-12} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: 10,
                    }}
                  >
                    {formatTick(tick.value, timezone, data.length)}
                  </text>
                </g>
              );
            },
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'customers',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          labelFormat={(labelValue) => ((<tspan y={-8}>{labelValue}</tspan>) as unknown) as string}
          tooltip={({ id, value, color, indexValue }) => {
            return (
              <span style={{ color }}>
                {id} - {formalFullEpoch(indexValue, timezone)} : <strong>{value}</strong>
              </span>
            );
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    );
  }
}
