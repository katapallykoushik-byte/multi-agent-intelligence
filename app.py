# ============================================================
# MULTI-AGENT AI DECISION SUPPORT SYSTEM
# PHASE 1: UNIVERSAL DATASET INTELLIGENCE ENGINE
# ============================================================

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import re


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="Multi-Agent AI Decision Support",
    page_icon="🧠",
    layout="wide"
)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

@st.cache_data
def load_dataset(uploaded_file):
    """
    Load CSV or Excel datasets.
    """

    file_name = uploaded_file.name.lower()

    if file_name.endswith(".csv"):

        try:
            df = pd.read_csv(uploaded_file)

        except UnicodeDecodeError:
            uploaded_file.seek(0)
            df = pd.read_csv(uploaded_file, encoding="latin1")

    elif file_name.endswith(".xlsx"):

        df = pd.read_excel(
            uploaded_file,
            engine="openpyxl"
        )

    elif file_name.endswith(".xls"):

        df = pd.read_excel(uploaded_file)

    else:

        raise ValueError(
            "Unsupported file format."
        )

    return df


def clean_column_names(df):
    """
    Standardize column names.
    """

    df = df.copy()

    cleaned_columns = []

    for column in df.columns:

        column = str(column).strip()

        column = re.sub(
            r"[^A-Za-z0-9_]+",
            "_",
            column
        )

        column = re.sub(
            r"_+",
            "_",
            column
        )

        column = column.strip("_")

        cleaned_columns.append(column)

    df.columns = cleaned_columns

    return df


def detect_id_columns(df):
    """
    Detect possible identifier columns.
    """

    id_columns = []

    if len(df) == 0:
        return id_columns

    for column in df.columns:

        column_name = str(column).lower()

        unique_ratio = (
            df[column].nunique(dropna=True)
            / len(df)
        )

        id_keywords = [
            "id",
            "code",
            "number",
            "no",
            "serial",
            "invoice",
            "transaction"
        ]

        if any(
            keyword in column_name
            for keyword in id_keywords
        ):

            id_columns.append(column)

        elif unique_ratio >= 0.95:

            id_columns.append(column)

    return list(set(id_columns))


def detect_datetime_columns(df):
    """
    Detect columns that likely contain dates.
    """

    datetime_columns = []

    date_keywords = [
        "date",
        "time",
        "day",
        "month",
        "year",
        "timestamp"
    ]

    for column in df.columns:

        column_name = str(column).lower()

        if pd.api.types.is_datetime64_any_dtype(
            df[column]
        ):

            datetime_columns.append(column)

        elif any(
            keyword in column_name
            for keyword in date_keywords
        ):

            try:

                converted = pd.to_datetime(
                    df[column],
                    errors="coerce"
                )

                valid_ratio = (
                    converted.notna().mean()
                )

                if valid_ratio >= 0.60:

                    datetime_columns.append(column)

            except Exception:
                pass

    return list(set(datetime_columns))


def get_column_types(
    df,
    id_columns,
    datetime_columns
):
    """
    Categorize columns.
    """

    numerical_columns = []

    categorical_columns = []

    for column in df.columns:

        if column in id_columns:

            continue

        elif column in datetime_columns:

            continue

        elif pd.api.types.is_numeric_dtype(
            df[column]
        ):

            numerical_columns.append(column)

        else:

            categorical_columns.append(column)

    return (
        numerical_columns,
        categorical_columns
    )


def detect_outliers(
    df,
    numerical_columns
):
    """
    Detect potential outliers using IQR.
    """

    results = []

    for column in numerical_columns:

        series = df[column].dropna()

        if len(series) < 4:
            continue

        Q1 = series.quantile(0.25)

        Q3 = series.quantile(0.75)

        IQR = Q3 - Q1

        if IQR == 0:
            outlier_count = 0

        else:

            lower_bound = (
                Q1 - 1.5 * IQR
            )

            upper_bound = (
                Q3 + 1.5 * IQR
            )

            outlier_count = (
                (
                    series < lower_bound
                )
                |
                (
                    series > upper_bound
                )
            ).sum()

        results.append({

            "Column": column,

            "Potential Outliers":
                int(outlier_count),

            "Outlier Percentage":
                round(
                    (
                        outlier_count
                        / len(series)
                    ) * 100,
                    2
                )
        })

    return pd.DataFrame(results)


def calculate_quality_score(df):
    """
    Calculate an interpretable
    data quality score out of 100.
    """

    if df.empty:
        return 0

    score = 100

    total_cells = (
        df.shape[0]
        * df.shape[1]
    )

    if total_cells > 0:

        missing_percentage = (
            df.isna().sum().sum()
            / total_cells
        ) * 100

        score -= min(
            missing_percentage * 1.5,
            35
        )

    duplicate_percentage = (
        df.duplicated().mean()
        * 100
    )

    score -= min(
        duplicate_percentage * 2,
        25
    )

    constant_columns = sum(

        df[column]
        .nunique(dropna=False)
        <= 1

        for column in df.columns
    )

    score -= min(
        constant_columns * 5,
        20
    )

    return round(
        max(score, 0),
        2
    )


def preprocess_dataset(df):
    """
    Perform universal preprocessing
    while preserving potentially important data.
    """

    df = df.copy()

    preprocessing_log = []

    # --------------------------------------------------------
    # 1. CLEAN COLUMN NAMES
    # --------------------------------------------------------

    df = clean_column_names(df)

    preprocessing_log.append(
        "Standardized column names"
    )

    # --------------------------------------------------------
    # 2. REMOVE COMPLETELY EMPTY ROWS
    # --------------------------------------------------------

    empty_rows = df.isna().all(axis=1).sum()

    if empty_rows > 0:

        df = df.dropna(
            how="all"
        )

        preprocessing_log.append(
            f"Removed {empty_rows} completely empty rows"
        )

    # --------------------------------------------------------
    # 3. REMOVE DUPLICATE ROWS
    # --------------------------------------------------------

    duplicate_rows = df.duplicated().sum()

    if duplicate_rows > 0:

        df = df.drop_duplicates()

        preprocessing_log.append(
            f"Removed {duplicate_rows} duplicate rows"
        )

    # --------------------------------------------------------
    # 4. REMOVE CONSTANT COLUMNS
    # --------------------------------------------------------

    constant_columns = [

        column

        for column in df.columns

        if df[column]
        .nunique(dropna=False)
        <= 1
    ]

    if constant_columns:

        df = df.drop(
            columns=constant_columns
        )

        preprocessing_log.append(
            f"Removed constant columns: "
            f"{', '.join(constant_columns)}"
        )

    # --------------------------------------------------------
    # 5. DETECT ID AND DATETIME COLUMNS
    # --------------------------------------------------------

    id_columns = detect_id_columns(df)

    datetime_columns = detect_datetime_columns(df)

    # Convert detected datetime columns

    for column in datetime_columns:

        df[column] = pd.to_datetime(
            df[column],
            errors="coerce"
        )

    if id_columns:

        preprocessing_log.append(
            f"Detected possible ID columns: "
            f"{', '.join(id_columns)}"
        )

    if datetime_columns:

        preprocessing_log.append(
            f"Detected datetime columns: "
            f"{', '.join(datetime_columns)}"
        )

    # --------------------------------------------------------
    # 6. DETERMINE COLUMN TYPES
    # --------------------------------------------------------

    (
        numerical_columns,
        categorical_columns

    ) = get_column_types(

        df,
        id_columns,
        datetime_columns
    )

    # --------------------------------------------------------
    # 7. HANDLE NUMERICAL MISSING VALUES
    # --------------------------------------------------------

    for column in numerical_columns:

        missing_count = (
            df[column]
            .isna()
            .sum()
        )

        if missing_count > 0:

            median_value = (
                df[column]
                .median()
            )

            df[column] = (
                df[column]
                .fillna(median_value)
            )

            preprocessing_log.append(
                f"Filled {missing_count} missing values "
                f"in '{column}' using median"
            )

    # --------------------------------------------------------
    # 8. HANDLE CATEGORICAL MISSING VALUES
    # --------------------------------------------------------

    for column in categorical_columns:

        missing_count = (
            df[column]
            .isna()
            .sum()
        )

        if missing_count > 0:

            mode_values = (
                df[column]
                .mode()
            )

            if not mode_values.empty:

                fill_value = (
                    mode_values.iloc[0]
                )

            else:

                fill_value = "Unknown"

            df[column] = (
                df[column]
                .fillna(fill_value)
            )

            preprocessing_log.append(
                f"Filled {missing_count} missing values "
                f"in '{column}' using mode"
            )

    return (
        df,
        preprocessing_log,
        id_columns,
        datetime_columns
    )


# ============================================================
# APPLICATION HEADER
# ============================================================

st.title(
    "🧠 Multi-Agent AI Decision Support System"
)

st.markdown(
    """
    ### Phase 1 — Universal Dataset Intelligence Engine

    Upload a CSV or Excel dataset. The system will automatically inspect
    the dataset, evaluate data quality, identify data types, detect missing
    values, duplicates and potential outliers, and generate a cleaned
    version for the next stages of AI analysis.
    """
)

st.divider()


# ============================================================
# FILE UPLOAD
# ============================================================

uploaded_file = st.file_uploader(

    "📁 Upload your business dataset",

    type=[
        "csv",
        "xlsx",
        "xls"
    ]

)


# ============================================================
# MAIN APPLICATION
# ============================================================

if uploaded_file is not None:

    try:

        # ----------------------------------------------------
        # LOAD DATA
        # ----------------------------------------------------

        with st.spinner(
            "Loading dataset..."
        ):

            df = load_dataset(
                uploaded_file
            )

        # Store original dataset

        st.session_state[
            "original_df"
        ] = df.copy()


        # ----------------------------------------------------
        # DATASET OVERVIEW
        # ----------------------------------------------------

        st.header(
            "📊 Dataset Overview"
        )

        col1, col2, col3, col4 = st.columns(4)

        col1.metric(
            "Rows",
            f"{df.shape[0]:,}"
        )

        col2.metric(
            "Columns",
            f"{df.shape[1]:,}"
        )

        col3.metric(
            "Missing Values",
            f"{df.isna().sum().sum():,}"
        )

        col4.metric(
            "Duplicate Rows",
            f"{df.duplicated().sum():,}"
        )


        # ----------------------------------------------------
        # DATA QUALITY SCORE
        # ----------------------------------------------------

        quality_score = (
            calculate_quality_score(df)
        )

        st.subheader(
            "🏆 Data Quality Score"
        )

        score_col1, score_col2 = st.columns(
            [1, 4]
        )

        with score_col1:

            st.metric(
                "Quality Score",
                f"{quality_score}/100"
            )

        with score_col2:

            st.progress(
                int(quality_score)
            )


        # ----------------------------------------------------
        # DATA PREVIEW
        # ----------------------------------------------------

        st.subheader(
            "👀 Dataset Preview"
        )

        st.dataframe(
            df.head(10),
            use_container_width=True
        )


        # ====================================================
        # COLUMN INTELLIGENCE
        # ====================================================

        st.divider()

        st.header(
            "🔍 Column Intelligence"
        )

        id_columns = detect_id_columns(df)

        datetime_columns = (
            detect_datetime_columns(df)
        )

        (
            numerical_columns,
            categorical_columns

        ) = get_column_types(

            df,
            id_columns,
            datetime_columns
        )

        detected_types = []

        for column in df.columns:

            if column in id_columns:

                detected_types.append(
                    "ID"
                )

            elif column in datetime_columns:

                detected_types.append(
                    "Datetime"
                )

            elif column in numerical_columns:

                detected_types.append(
                    "Numerical"
                )

            else:

                detected_types.append(
                    "Categorical"
                )

        column_summary = pd.DataFrame({

            "Column":
                df.columns,

            "Data Type":
                df.dtypes.astype(str).values,

            "Detected Type":
                detected_types,

            "Missing Values":
                df.isna().sum().values,

            "Missing Percentage":

                np.round(

                    (
                        df.isna().sum()
                        / len(df)
                    ) * 100,

                    2

                ).values,

            "Unique Values":
                df.nunique().values

        })

        st.dataframe(
            column_summary,
            use_container_width=True
        )


        # ====================================================
        # MISSING VALUE ANALYSIS
        # ====================================================

        st.divider()

        st.header(
            "⚠️ Missing Value Analysis"
        )

        missing_data = pd.DataFrame({

            "Column":
                df.columns,

            "Missing Values":
                df.isna().sum().values,

            "Missing Percentage":

                np.round(

                    (
                        df.isna().sum()
                        / len(df)
                    ) * 100,

                    2

                ).values

        })

        missing_data = missing_data[
            missing_data[
                "Missing Values"
            ] > 0
        ]

        if not missing_data.empty:

            st.dataframe(
                missing_data,
                use_container_width=True
            )

            fig_missing = px.bar(

                missing_data,

                x="Column",

                y="Missing Percentage",

                title=(
                    "Missing Values by Column"
                )

            )

            st.plotly_chart(
                fig_missing,
                use_container_width=True
            )

        else:

            st.success(
                "No missing values detected."
            )


        # ====================================================
        # DUPLICATE ANALYSIS
        # ====================================================

        st.divider()

        st.header(
            "🔁 Duplicate Analysis"
        )

        duplicate_count = (
            df.duplicated().sum()
        )

        duplicate_percentage = (
            df.duplicated().mean()
            * 100
        )

        duplicate_col1, duplicate_col2 = st.columns(2)

        duplicate_col1.metric(
            "Duplicate Rows",
            f"{duplicate_count:,}"
        )

        duplicate_col2.metric(
            "Duplicate Percentage",
            f"{duplicate_percentage:.2f}%"
        )


        # ====================================================
        # OUTLIER ANALYSIS
        # ====================================================

        st.divider()

        st.header(
            "📈 Potential Outlier Analysis"
        )

        if numerical_columns:

            outlier_df = detect_outliers(

                df,

                numerical_columns

            )

            if not outlier_df.empty:

                outlier_df = (

                    outlier_df
                    .sort_values(

                        "Potential Outliers",

                        ascending=False

                    )

                )

                st.dataframe(

                    outlier_df,

                    use_container_width=True

                )

                fig_outliers = px.bar(

                    outlier_df,

                    x="Column",

                    y="Potential Outliers",

                    title=(
                        "Potential Outliers by Numerical Variable"
                    )

                )

                st.plotly_chart(

                    fig_outliers,

                    use_container_width=True

                )

            else:

                st.info(
                    "Not enough numerical data for outlier analysis."
                )

        else:

            st.info(
                "No numerical columns detected."
            )


        # ====================================================
        # AUTOMATIC PREPROCESSING
        # ====================================================

        st.divider()

        st.header(
            "⚙️ Automatic Data Preprocessing"
        )

        st.write(
            """
            The preprocessing engine will standardize column names,
            remove empty and duplicate rows, remove constant columns,
            detect IDs and datetime variables, and intelligently handle
            missing numerical and categorical values.
            """
        )

        if st.button(

            "🚀 Run Automatic Preprocessing",

            type="primary",

            use_container_width=True

        ):

            with st.spinner(

                "Running intelligent preprocessing..."

            ):

                (

                    cleaned_df,
                    preprocessing_log,
                    detected_id_columns,
                    detected_datetime_columns

                ) = preprocess_dataset(
                    df
                )


            # Store results

            st.session_state[
                "cleaned_df"
            ] = cleaned_df

            st.session_state[
                "preprocessing_log"
            ] = preprocessing_log

            st.session_state[
                "id_columns"
            ] = detected_id_columns

            st.session_state[
                "datetime_columns"
            ] = detected_datetime_columns


            st.success(
                "Preprocessing completed successfully!"
            )


            # ------------------------------------------------
            # BEFORE VS AFTER
            # ------------------------------------------------

            st.subheader(
                "📊 Before vs After"
            )

            before_after = pd.DataFrame({

                "Metric": [

                    "Rows",
                    "Columns",
                    "Missing Values",
                    "Duplicate Rows"

                ],

                "Before": [

                    df.shape[0],

                    df.shape[1],

                    df.isna().sum().sum(),

                    df.duplicated().sum()

                ],

                "After": [

                    cleaned_df.shape[0],

                    cleaned_df.shape[1],

                    cleaned_df.isna().sum().sum(),

                    cleaned_df.duplicated().sum()

                ]

            })

            st.dataframe(

                before_after,

                use_container_width=True

            )


            # ------------------------------------------------
            # PREPROCESSING LOG
            # ------------------------------------------------

            st.subheader(
                "📋 Actions Performed"
            )

            for action in preprocessing_log:

                st.write(
                    f"✓ {action}"
                )


            # ------------------------------------------------
            # CLEANED DATA PREVIEW
            # ------------------------------------------------

            st.subheader(
                "🧹 Cleaned Dataset Preview"
            )

            st.dataframe(

                cleaned_df.head(10),

                use_container_width=True

            )


            # ------------------------------------------------
            # DOWNLOAD CLEANED DATA
            # ------------------------------------------------

            csv_data = (

                cleaned_df
                .to_csv(index=False)
                .encode("utf-8")

            )

            st.download_button(

                label=(
                    "⬇️ Download Cleaned Dataset"
                ),

                data=csv_data,

                file_name=(
                    "cleaned_dataset.csv"
                ),

                mime="text/csv",

                use_container_width=True

            )


    except Exception as error:

        st.error(
            f"Error processing dataset: {error}"
        )


else:

    st.info(
        "👆 Upload a CSV or Excel dataset to begin."
    )   