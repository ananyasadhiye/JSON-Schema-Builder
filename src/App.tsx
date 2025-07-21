import React, { useState } from 'react';
import { Button, Tabs, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import type { Field } from './types';
import { convertToJson } from './utils';
import SchemaField from './components/SchemaField';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;

function App() {
  const [fields, setFields] = useState<Field[]>([]);

  const addField = (parentId?: string) => {
    const newField: Field = {
      id: uuidv4(),
      name: '',
      type: 'string'
    };

    if (!parentId) {
      setFields([...fields, newField]);
    } else {
      setFields(updateNested(fields, parentId, (f) => {
        f.fields = f.fields ? [...f.fields, newField] : [newField];
      }));
    }
  };

  const updateField = (id: string, key: keyof Field, value: any) => {
    setFields(updateNested(fields, id, (f) => {
      (f as any)[key] = value;
      if (key === 'type' && value !== 'nested') f.fields = undefined;
    }));
  };

  const deleteField = (id: string) => {
    const removeById = (items: Field[]): Field[] =>
      items.filter(f => f.id !== id).map(f => ({
        ...f,
        fields: f.fields ? removeById(f.fields) : undefined
      }));
    setFields(removeById(fields));
  };

  const updateNested = (
    items: Field[],
    id: string,
    updater: (f: Field) => void
  ): Field[] =>
    items.map((f) => {
      if (f.id === id) {
        const updated = { ...f };
        updater(updated);
        return updated;
      }
      if (f.fields) {
        return { ...f, fields: updateNested(f.fields, id, updater) };
      }
      return f;
    });

  const renderFields = (list: Field[]) =>
    list.map((field) => (
      <SchemaField
        key={field.id}
        field={field}
        onChange={updateField}
        onDelete={deleteField}
        onAddChild={addField}
        renderChildren={renderFields}
      />
    ));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <Title level={2}>🧩 JSON Schema Builder</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Builder" key="1">
          {renderFields(fields)}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => addField()}
            style={{ marginTop: 16 }}
          >
            Add Field
          </Button>
        </TabPane>
        <TabPane tab="JSON" key="2">
          <pre style={{ background: '#f6f8fa', padding: 16, borderRadius: 6 }}>
            {JSON.stringify(convertToJson(fields), null, 2)}
          </pre>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
