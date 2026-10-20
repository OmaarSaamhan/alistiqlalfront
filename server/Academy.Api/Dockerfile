FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Academy.Api.csproj ./
RUN dotnet restore Academy.Api.csproj
COPY . ./
RUN dotnet publish Academy.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production
COPY --from=build /app/publish ./
EXPOSE 8080
ENTRYPOINT ["dotnet", "Academy.Api.dll"]
