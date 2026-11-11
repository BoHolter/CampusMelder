export type MeldingStatus = 'nieuw' | 'in behandeling' | 'afgerond';

export type MeldingCategorie = 'Meubilair' | 'Schoonmaak' | 'ICT' | 'Overig';

export interface Melding {
  id: string;
  titel: string;
  categorie: MeldingCategorie;
  beschrijving: string;
  locatie: string;
  fotoUri: string | null;
  status: MeldingStatus;
  createdAt: string;
  synced: boolean;
}

export const CATEGORIEEN: MeldingCategorie[] = [
  'Meubilair',
  'Schoonmaak',
  'ICT',
  'Overig',
];

export const STATUSSEN: MeldingStatus[] = [
  'nieuw',
  'in behandeling',
  'afgerond',
];
