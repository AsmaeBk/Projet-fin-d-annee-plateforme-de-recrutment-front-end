export class Candidat {
  constructor(
    public id: number,
   public posteId:number,
    public adresse: string,
   public anneeDiplome:number,
   public age:number,
    public CIN: string,
    public codePostal:number,

    public intituleDiplome: string,
    public email: string,
    public etablissement: string,
    public NomComplet: string,
    public Specialite: string,
    public Tel: string,
    public ville: string,
    public CINfile: string,
    public diplomeFile: string,
    public CvFile: string,
    public posteTitle:string
  ) {
  }
}
