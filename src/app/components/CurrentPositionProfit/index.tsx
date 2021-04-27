/**
 *
 * TradeButton
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { LoadableValue } from '../LoadableValue';
import { bignumber } from 'mathjs';
import { AssetRenderer } from '../../components/CurrencyAsset';
interface Props {
  source: Asset;
  destination: Asset;
  amount: string;
  startPrice: number;
  isLong: boolean;
}

export function CurrentPositionProfit(props: Props) {
  const { t } = useTranslation();
  const { loading, price } = useCurrentPositionPrice(
    props.destination,
    props.source,
    props.amount,
    props.isLong,
  );
  let profit = '0';

  let diff = 1;
  if (props.isLong) {
    diff = (price - props.startPrice) / price;
    // profit = (price - props.startPrice) * positionSize;
    profit = bignumber(props.amount).mul(diff).toFixed(0);
  } else {
    diff = (props.startPrice - price) / props.startPrice;
    profit = bignumber(props.amount).mul(diff).toFixed(0);
  }

  function Change() {
    if (diff > 0) {
      return (
        <>
          {t(translations.tradingHistoryPage.table.profitLabels.up)}
          <span className="tw-text-green">{toNumberFormat(diff * 100, 2)}</span>
          %
        </>
      );
    }
    if (diff < 0) {
      return (
        <>
          {t(translations.tradingHistoryPage.table.profitLabels.down)}
          <span className="tw-text-red">
            {toNumberFormat(Math.abs(diff * 100), 2)}
          </span>
          %
        </>
      );
    }
    return (
      <>{t(translations.tradingHistoryPage.table.profitLabels.noChange)}</>
    );
  }
  return (
    <>
      <LoadableValue
        loading={loading}
        value={
          <>
            <span className={diff < 0 ? 'tw-text-red' : 'tw-text-green'}>
              {diff > 0 && '+'}
              {weiToNumberFormat(profit, 8)}{' '}
              <AssetRenderer asset={props.destination} />
            </span>
          </>
        }
        tooltip={
          <>
            <Change />
          </>
        }
      />
    </>
  );
}
