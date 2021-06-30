import { Frame } from './../types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const processData = (series: Frame[]) => {
  let isEqual = true,
    isZero = true;

  const len_0 = series[0].length;

  series.map((serie) => {
    if (serie.length != len_0) {
      isEqual = false;
      return;
    }
  });

  if (!isEqual) return { data: [], keys: [] };

  series.map((serie) => {
    if (Math.max(...serie.fields[0].values.buffer) > 0) {
      isZero = false;
      return;
    }
  });

  if (isZero) return { data: [], keys: [] };

  const visualData = series.filter((serie) => serie.name != 'Sum count');
  const totalData = series.filter((serie) => serie.name == 'Sum count');

  if (totalData.length == 0 || visualData.length == 0) return { data: [], keys: [] };

  const result: Array<{ [key: string]: any }> = series[0].fields[1].values.buffer.map((time_num) => ({
    timestamp: time_num,
  }));

  const keys: string[] = [];

  const totalBuffer = totalData[0].fields[0].values.buffer;

  visualData.map((category) => {
    const group = category.name || 'dummy';
    keys.push(group);
    category.fields[0].values.buffer.map((value, idx) => {
      if (totalBuffer[idx] == 0) {
        result[idx][group] = 0;
        return;
      }

      result[idx][group] = Math.round((value / totalBuffer[idx]) * 1000) / 10;
    });
  });

  return { data: result, keys: keys };
};

export const formatTick = (epoch: React.Key, timezone: string, length: number) => {
  const datetime = dayjs(epoch).tz(timezone);
  if (length <= 30) return datetime.format('DD/MM');
  if (length <= 85) {
    if (datetime.date() == 10 || datetime.date() == 20 || datetime.date() == 30) return datetime.format('DD/MM');
    else return '';
  }

  if (datetime.date() == 1) return datetime.format('DD/MM');
  else return '';
};
export const formalFullEpoch = (epoch: React.Key, timezone: string) => {
  return dayjs(epoch).tz(timezone).format('DD/MM/YYYY');
};
