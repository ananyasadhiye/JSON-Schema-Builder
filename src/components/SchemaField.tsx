import React from 'react';
import type { Field } from '../types';
import { Input, Select, Button, Space, Card } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  field: Field;
  onChange: (id: string, key: keyof Field, value: any) => void;
  onDelete: (id: string) => void;
  onAddChild: (id: string) => void;
  renderChildren: (fields: Field[]) => React.ReactNode;
}

const SchemaField: React.FC<Props> = ({
  field,
  onChange,
  onDelete,
  onAddChild,
  renderChildren
}) => {
  return (
    <Card
      size="small"
      style={{ marginBottom: 12, background: '#fff', borderRadius: 8 }}
    >
      <Space wrap>
        <Input
          placeholder="Enter field name"
          value={field.name}
          onChange={(e) => onChange(field.id, 'name', e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          value={field.type}
          onChange={(value) => onChange(field.id, 'type', value)}
          style={{ width: 120 }}
        >
          <Option value="string">String</Option>
          <Option value="number">Number</Option>
          <Option value="nested">Nested</Option>
        </Select>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(field.id)}
        />
        {field.type === 'nested' && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => onAddChild(field.id)}
          >
            Add Nested Field
          </Button>
        )}
      </Space>

      {field.type === 'nested' && (
        <div style={{ marginLeft: 24, marginTop: 12 }}>
          {renderChildren(field.fields || [])}
        </div>
      )}
    </Card>
  );
};

export default SchemaField;
