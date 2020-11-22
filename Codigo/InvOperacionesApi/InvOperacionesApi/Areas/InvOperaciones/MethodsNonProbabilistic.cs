using InvOperacionesApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InvOperacionesApi.Areas.InvOperaciones
{
    public class MethodsNonProbabilistic
    {

        private static int Nalter = 0;     // Número de alternativas
        private static int Nest = 0;       // Número de estados de la Naturaleza
        private static String[] Alter;        // Alternativas
        private static String[] Estado;       // Estados  
        private static double[,] Resultado;    // Resultados

        public MethodsNonProbabilistic(string[,] matriz)
        {
            Nalter = matriz.GetLength(0)-1;
            Nest = matriz.GetLength(1)-1;           
            LlenarResultado(matriz);
        }

        private void LlenarResultado(string[,] matriz)
        {
            //Llena tabla de resultados
            Resultado = new double[Nalter, Nest];
            for (int i = 0; i < Resultado.GetLength(0); i++)
            {
                for (int j = 0; j < Resultado.GetLength(1); j++)
                {
                    Resultado[i, j] = Convert.ToDouble(matriz[i+1, j+1]);
                }
            }

            //Llena arreglo de estados
            Estado = new string[Nest];
            for (int i = 0; i < Estado.GetLength(0); i++)
            {
                Estado[i] = matriz[0, i+1];
            }

            //Lena arreglo de alternativas
            Alter = new string[Nalter];
            for (int i = 0; i < Alter.GetLength(0); i++)
            {
                Alter[i] = matriz[i+1, 0];
            }
        }

        /// <summary>
        /// Criterio Wald
        /// </summary>
        /// <returns></returns>
        public ResultCriteriosDecision Wald()
        {
            ResultCriteriosDecision resultCriteriosDecision = new ResultCriteriosDecision() { Criterio = "Wald" };
            double Maximo = Double.MinValue;
            int AltMax = 1;
            double Minimo;
            int EstMin = 1;
            int i, j;

            for (i = 0; i < Nalter; i++)
            {
                Minimo = Double.PositiveInfinity;
                for (j = 0; j < Nest; j++)
                {
                    if (Resultado[i,j] < Minimo)
                    {
                        Minimo = Resultado[i,j];
                        EstMin = j + 1;
                    }
                }
                resultCriteriosDecision.Descripcion += "Alt. " + (i + 1) + ": Valoracion=" + Minimo + "  Estado=" + EstMin + "; ";                

                if (Minimo > Maximo)
                {
                    Maximo = Minimo;
                    AltMax = i + 1;
                }
            }
            resultCriteriosDecision.Resultado = "Alternativa óptima: " + AltMax + " " + Alter[AltMax - 1];
            return resultCriteriosDecision;
        }

        /// <summary>
        /// Criterio Maximax
        /// </summary>
        /// <returns></returns>
        public ResultCriteriosDecision Maximax()
        {
            ResultCriteriosDecision resultCriteriosDecision = new ResultCriteriosDecision() { Criterio = "Maximax" };
            double Maximo = Double.NegativeInfinity;
            int AltMax = 1;

            double MaximoAux;
            int EstMax = 1;

            int i, j;

            for (i = 0; i < Nalter; i++)
            {

                MaximoAux = Double.NegativeInfinity;
                for (j = 0; j < Nest; j++)
                {
                    if (Resultado[i,j] > MaximoAux)
                    {
                        MaximoAux = Resultado[i,j];
                        EstMax = j + 1;
                    }
                }
                resultCriteriosDecision.Descripcion += "Alt. " + (i + 1) + ": Valoracion=" + MaximoAux + "  Estado=" + EstMax + "; ";

                if (MaximoAux > Maximo)
                {
                    Maximo = MaximoAux;
                    AltMax = i + 1;
                }
            }
            
            resultCriteriosDecision.Resultado = "Alternativa óptima: " + AltMax + " " + Alter[AltMax - 1];
            return resultCriteriosDecision;
        }

        /// <summary>
        /// Criterio Savage
        /// </summary>
        /// <returns></returns>
        public ResultCriteriosDecision Savage()
        {
            ResultCriteriosDecision resultCriteriosDecision = new ResultCriteriosDecision() { Criterio = "Savage" };
            double Maximo = Double.MaxValue;
            int EstMax = 1;

            double Minimo = Double.PositiveInfinity;
            int AltMin = 1;

            int i, j;

            /*
            /* Construir matriz de pérdidas relativas
            */
            double[,] PerdidaRel = new double[Nalter,Nest];

            for (j = 0; j < Nest; j++)
            {
                Maximo = Double.NegativeInfinity;
                for (i = 0; i < Nalter; i++)
                    if (Resultado[i,j] > Maximo) Maximo = Resultado[i,j];

                for (i = 0; i < Nalter; i++)
                    PerdidaRel[i,j] = Maximo - Resultado[i,j];
            }

            /*
            ** Determinar el minimo de las mayores perdidas relativas por filas 
            */

            for (i = 0; i < Nalter; i++)
            {
                Maximo = Double.NegativeInfinity;
                for (j = 0; j < Nest; j++)
                {
                    if (PerdidaRel[i,j] > Maximo)
                    {
                        Maximo = PerdidaRel[i,j];
                        EstMax = j + 1;
                    }
                }
                
                resultCriteriosDecision.Descripcion += "Alt. " + (i + 1) + ": Valoracion=" + Maximo + "  Estado=" + EstMax + "; ";
                if (Maximo < Minimo)
                {
                    Minimo = Maximo;
                    AltMin = i + 1;
                }
            }
            
            resultCriteriosDecision.Resultado = "Alternativa óptima: " + AltMin + " " + Alter[AltMin - 1];
            return resultCriteriosDecision;
        }

        /// <summary>
        /// Criterio Laplace
        /// </summary>
        /// <returns></returns>
        public ResultCriteriosDecision Laplace()
        {
            ResultCriteriosDecision resultCriteriosDecision = new ResultCriteriosDecision() { Criterio = "Laplace" };
            double Maximo = Double.NegativeInfinity;
            int AltMax = 1;

            int i, j;
            double Suma;
            double valorAlt;

            for (i = 0; i < Nalter; i++)
            {

                Suma = 0;
                for (j = 0; j < Nest; j++) Suma += Resultado[i,j];
                valorAlt = Suma / Nest;

                resultCriteriosDecision.Descripcion += "Alt. " + (i + 1) + ": Valoracion=" + valorAlt;
               
                if (valorAlt > Maximo)
                {
                    Maximo = valorAlt;
                    AltMax = i + 1;
                }
            }

            resultCriteriosDecision.Resultado = "Alternativa óptima: " + AltMax + " " + Alter[AltMax - 1] + "; ";
            return resultCriteriosDecision;
        }

        /// <summary>
        /// Criterio Hurwicz
        /// </summary>
        /// <param name="alfa"></param>
        /// <returns></returns>
        public ResultCriteriosDecision Hurwicz(double alfa)
        {
            ResultCriteriosDecision resultCriteriosDecision = new ResultCriteriosDecision() { Criterio = "Hurwicz" };

            double Maximo = Double.NegativeInfinity;
            int AltMax = 1;

            double MinimoAux;
            int EstMin = 1;
            double MaximoAux;
            int EstMax = 1;

            int i, j;
            double Alfa;
            double valorAlt;

            if (alfa > 0 && alfa < 1)
            {
                Alfa = alfa;
                for (i = 0; i < Nalter; i++)
                {

                    MinimoAux = Double.PositiveInfinity;
                    MaximoAux = Double.NegativeInfinity;
                    for (j = 0; j < Nest; j++)
                    {
                        if (Resultado[i, j] < MinimoAux)
                        {
                            MinimoAux = Resultado[i, j];
                            EstMin = j + 1;
                        }
                        if (Resultado[i, j] > MaximoAux)
                        {
                            MaximoAux = Resultado[i, j];
                            EstMax = j + 1;
                        }
                    }

                    valorAlt = Alfa * MinimoAux + (1 - Alfa) * MaximoAux;
                    resultCriteriosDecision.Descripcion += "Alt. " + (i + 1) + ": Valoracion=" + valorAlt + "  Estado=" + EstMin + "; ";

                    if (valorAlt > Maximo)
                    {
                        Maximo = valorAlt;
                        AltMax = i + 1;
                    }
                }

                resultCriteriosDecision.Resultado = "Alternativa óptima: " + AltMax + " " + Alter[AltMax - 1];
            }
            else {
                resultCriteriosDecision.Resultado = "Valor de Alfa no valido";
            }

            return resultCriteriosDecision;
        }
    }
}