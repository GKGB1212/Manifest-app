import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Segmented } from '@/components/ui/Field';
import { useT } from '@/hooks/useT';
import { Method369 } from './Method369';
import { Method55 } from './Method55';

export default function MethodsPage() {
  const { t } = useT();
  const [method, setMethod] = useState<'369' | '55'>('369');

  return (
    <div>
      <PageHeader
        title={t('methods.title')}
        subtitle={method === '369' ? t('m369.title') : t('m55.title')}
        action={
          <Segmented
            value={method}
            onChange={setMethod}
            options={[{ value: '369', label: '369' }, { value: '55', label: '55×5' }]}
          />
        }
      />
      {method === '369' ? <Method369 /> : <Method55 />}
    </div>
  );
}
