using InvOperacionesApi.Areas;
using InvOperacionesApi.Areas.InvOperaciones;
using InvOperacionesApi.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace InvOperacionesApi.Controllers
{
    [RoutePrefix("api/Metodos")]
    public class MetodosController : ApiController
    {

        [HttpPost]
        [Route("GetWaldCriterion")]
        public HttpResponseMessage GetWaldCriterion( RequestOpeInvApi request)
        {
            MethodsNonProbabilistic matrizPago = new MethodsNonProbabilistic(request.Matriz);           
            return this.Request.CreateResponse(HttpStatusCode.OK, matrizPago.Wald());
        }

        [HttpPost]
        [Route("GetMaximaxCriterion")]
        public HttpResponseMessage GetMaximaxCriterion(RequestOpeInvApi request)
        {
            MethodsNonProbabilistic matrizPago = new MethodsNonProbabilistic(request.Matriz);
            return this.Request.CreateResponse(HttpStatusCode.OK, matrizPago.Maximax());
        }

        [HttpPost]
        [Route("GetSavageCriterion")]
        public HttpResponseMessage GetSavageCriterion(RequestOpeInvApi request)
        {
            MethodsNonProbabilistic matrizPago = new MethodsNonProbabilistic(request.Matriz);
            return this.Request.CreateResponse(HttpStatusCode.OK, matrizPago.Savage());
        }

        [HttpPost]
        [Route("GetLaplaceCriterion")]
        public HttpResponseMessage GetLaplaceCriterion(RequestOpeInvApi request)
        {
            MethodsNonProbabilistic matrizPago = new MethodsNonProbabilistic(request.Matriz);
            return this.Request.CreateResponse(HttpStatusCode.OK, matrizPago.Laplace());
        }

        [HttpPost]
        [Route("GetHurwiczCriterion")]
        public HttpResponseMessage GetHurwiczCriterion(RequestOpeInvApi request)
        {
            MethodsNonProbabilistic matrizPago = new MethodsNonProbabilistic(request.Matriz);
            return this.Request.CreateResponse(HttpStatusCode.OK, matrizPago.Hurwicz(request.Alfa));
        }

        [HttpPost]
        [Route("GetMatrizEMV")]
        public HttpResponseMessage GetMatrizEMV(RequestProbabilisticMethod request)
        {
            MethodsProbabilistic matrizPago = new MethodsProbabilistic(request.Matriz, request.Probability);
            return this.Request.CreateResponse(HttpStatusCode.OK, matrizPago.MethodEMV());
        }

        [HttpPost]
        [Route("GetMatrizEOL")]
        public HttpResponseMessage GetMatrizEOL(RequestProbabilisticMethod request)
        {
            MethodsProbabilistic matrizPago = new MethodsProbabilistic(request.Matriz, request.Probability);
            return this.Request.CreateResponse(HttpStatusCode.OK, matrizPago.MethodEOL());
        }

        [HttpPost]
        [Route("GetSensitivityAnalysis")]
        public HttpResponseMessage GetSensitivityAnalysis(RequestProbabilisticMethod request)
        {
            MethodsProbabilistic matrizPago = new MethodsProbabilistic(request.Matriz, request.Probability);
            return this.Request.CreateResponse(HttpStatusCode.OK, matrizPago.MethodSensitivityAnalysis());
        }

    }
}