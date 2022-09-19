export interface Group {
    name: string;
    id: string;
    rooms: { name: string; id: string }[];
}