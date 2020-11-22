using InvOperacionesApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InvOperacionesApi.Areas
{
    public class MethodsProbabilistic
    {

        private static int Nalter = 0;     // Número de alternativas
        private static int Nest = 0;       // Número de estados de la Naturaleza
        private static int Nprob = 0;       // Número de probabilidades
        private static String[] Alter;        // Alternativas
        private static String[] Estado;       // Estados  
        private static double[] Probailidades;       // Probabilidades  
        private static double[,] Resultado;    // Resultados

        public MethodsProbabilistic(string[,] matriz, double[] probabilidades)
        {
            Nalter = matriz.GetLength(0) - 1;
            Nest = matriz.GetLength(1) - 1;
            Nprob = probabilidades.GetLength(0);
            LlenarResultado(matriz);
            LlenarProbabilidad(probabilidades);
        }

        private void LlenarResultado(string[,] matriz)
        {
            //Llena tabla de resultados
            Resultado = new double[Nalter, Nest];
            for (int i = 0; i < Resultado.GetLength(0); i++)
            {
                for (int j = 0; j < Resultado.GetLength(1); j++)
                {
                    Resultado[i, j] = Convert.ToDouble(matriz[i + 1, j + 1]);
                }
            }

            //Llena arreglo de estados
            Estado = new string[Nest];
            for (int i = 0; i < Estado.GetLength(0); i++)
            {
                Estado[i] = matriz[0, i + 1];
            }

            //Lena arreglo de alternativas
            Alter = new string[Nalter];
            for (int i = 0; i < Alter.GetLength(0); i++)
            {
                Alter[i] = matriz[i + 1, 0];
            }
        }

        private void LlenarProbabilidad(double[] probabilidades)
        {
            //Llena arreglo de probabilidades
            Probailidades = new double[Nprob];
            for (int i = 0; i < Probailidades.GetLength(0); i++)
            {
                Probailidades[i] = Convert.ToDouble(probabilidades[i]);
            }
        }

        public ResponseProbabilisticMethod MethodEMV()
        {
            ResponseProbabilisticMethod responseProbabilisticMethod = new ResponseProbabilisticMethod();
            int Ncol = Nest + 2;
            int Nfil = Nalter+1;
            string[,] matrizEMV = new string[Nfil, Ncol];
            matrizEMV[0, 0] = "Alt/Est";
            //Llenar titulos de estados
            for (int i = 1; i < Ncol; i++)
            {
                if (i < Estado.GetLength(0)+1)
                    matrizEMV[0, i] = Estado[i-1];
                else
                    matrizEMV[0, i] = "EMV";
            }

            //Llenar titulos de alternativas
            for (int i = 1; i < Nfil; i++)
            {
                matrizEMV[i, 0] = Alter[i - 1];
            }

            //Llena resuldtados
            double resultEMV = Double.MinValue;
            int AltBest = 1;
            for (int i = 0; i < Resultado.GetLength(0); i++)
            {
                double valEMV = 0;
                for (int j = 0; j < Resultado.GetLength(1); j++)
                {
                    matrizEMV[i+1, j+1] = Convert.ToDouble(Resultado[i, j]).ToString();
                    valEMV += Resultado[i, j] * Probailidades[j];
                }
                if (valEMV > resultEMV)
                { 
                    resultEMV = valEMV;
                    AltBest = i + 1;
                }
                matrizEMV[i + 1, Resultado.GetLength(1) + 1] = valEMV.ToString();
            }
            responseProbabilisticMethod.Matriz = matrizEMV;
            responseProbabilisticMethod.Result = "Alternativa óptima: " + AltBest + " " + matrizEMV[AltBest, 0] + " - Valoración: " + resultEMV;
            return responseProbabilisticMethod;
        }

        public ResponseProbabilisticMethod MethodEOL()
        {
            ResponseProbabilisticMethod responseProbabilisticMethod = new ResponseProbabilisticMethod();
            int Ncol = Nest + 2;
            int Nfil = Nalter + 1;
            string[,] matrizEMV = new string[Nfil, Ncol];
            matrizEMV[0, 0] = "Alt/Est";
            //Llenar titulos de estados
            for (int i = 1; i < Ncol; i++)
            {
                if (i < Estado.GetLength(0) + 1)
                    matrizEMV[0, i] = Estado[i - 1];
                else
                    matrizEMV[0, i] = "EOL";
            }

            //Llenar titulos de alternativas
            for (int i = 1; i < Nfil; i++)
            {
                matrizEMV[i, 0] = Alter[i - 1];
            }



            //Construir matriz de pérdidas relativas

            double[,] PerdidaRel = new double[Nalter, Nest];
            double Maximo = Double.MaxValue;

            for (int j = 0; j < Nest; j++)
            {
                Maximo = Double.NegativeInfinity;
                for (int i = 0; i < Nalter; i++)
                    if (Resultado[i, j] > Maximo) Maximo = Resultado[i, j];

                for (int i = 0; i < Nalter; i++)
                    PerdidaRel[i, j] = Maximo - Resultado[i, j];
            }


            //Llena resuldtados
            double resultEOL = Double.MaxValue;
            int AltBest = 1;
            for (int i = 0; i < PerdidaRel.GetLength(0); i++)
            {
                double valEMV = 0;
                for (int j = 0; j < PerdidaRel.GetLength(1); j++)
                {
                    matrizEMV[i + 1, j + 1] = Convert.ToDouble(PerdidaRel[i, j]).ToString();
                    valEMV += PerdidaRel[i, j] * Probailidades[j];
                }
                if (valEMV < resultEOL)
                {
                    resultEOL = valEMV;
                    AltBest = i+1;
                }
                matrizEMV[i + 1, PerdidaRel.GetLength(1) + 1] = valEMV.ToString();
            }
            responseProbabilisticMethod.Matriz = matrizEMV;
            responseProbabilisticMethod.Result = "Alternativa óptima: " + AltBest + " " + matrizEMV[AltBest,0] +" - Valoración: "+ resultEOL;
            return responseProbabilisticMethod;
        }

        public ResponseProbabilisticMethod MethodSensitivityAnalysis()
        {
            ResponseProbabilisticMethod responseProbabilisticMethod = new ResponseProbabilisticMethod();
            int Ncol = Nalter + 1;
            int Nfil = 12;
            string[,] matrizEMV = new string[Nfil, Ncol];
            matrizEMV[0, 0] = "Prob/EMV";
            //Llenar titulos de columnas
            for (int i = 1; i < Ncol; i++)
            {
                matrizEMV[0, i] = "EMV-" + Alter[i - 1];                    
            }

            double[] prob = new double[11];
            double x = 0.0;
            //Llenar titulos de alternativas
            for (int i = 1; i < Nfil; i++)
            {
                prob[i-1] = x;
                matrizEMV[i, 0] = x.ToString();
                x += 0.1;
            }

            for (int i = 1; i < matrizEMV.GetLength(0); i++)
            {
                for (int j = 1; j < matrizEMV.GetLength(1); j++)
                {
                    matrizEMV[i, j] = GetValueEMV(prob[i - 1], j-1).ToString();
                }
            }


            string[,] transpuesta = new string[matrizEMV.GetLength(1), matrizEMV.GetLength(0)];
            for (int a = 0; a < matrizEMV.GetLength(0); a++)
            {
                for (int b = 0; b < matrizEMV.GetLength(1); b++)
                {
                    transpuesta[b, a] = matrizEMV[a, b];
                }
            }


            responseProbabilisticMethod.Matriz = transpuesta;
            return responseProbabilisticMethod;
        }

        private double GetValueEMV(double nProb, int numFil) {
            double[] prob = new double[2];
            prob[0] = nProb;
            prob[1] = 1-nProb;
            //Llena resuldtados
            double valEMV = 0;
            for (int j = 0; j < Resultado.GetLength(1); j++)
            {
                valEMV += Resultado[numFil, j] * prob[j];
            }
            return valEMV;
        }
    }
}