FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# 1. Copy the csproj from the root context
COPY ["TuneApi/TuneApi/TuneApi.csproj", "TuneApi/TuneApi/"]
RUN dotnet restore "TuneApi/TuneApi/TuneApi.csproj"

# 2. Copy everything else from your repository into the container
COPY . .

# 3. Build the API project from its exact nested location
RUN dotnet build "TuneApi/TuneApi/TuneApi.csproj" -c Release -o /app/build

FROM build AS publish
# 4. Publish the application
RUN dotnet publish "TuneApi/TuneApi/TuneApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# 5. Point to the compiled DLL name
ENTRYPOINT ["dotnet", "TuneApi.dll"]
