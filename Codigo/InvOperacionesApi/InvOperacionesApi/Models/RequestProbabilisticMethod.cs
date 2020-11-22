using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InvOperacionesApi.Models
{
    public class RequestProbabilisticMethod
    {

        public string[,] Matriz { get; set; }
        public double[] Probability { get; set; }

    }
}